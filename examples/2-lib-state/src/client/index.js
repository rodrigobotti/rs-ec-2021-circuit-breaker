const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const Redis = require('ioredis')
const fetch = require('node-fetch')

const redis = new Redis(
  parseInt(process.env.REDIS_PORT),
  process.env.REDIS_HOST
)

const CircuitBreaker = ({
  name,
  errorThresholdPercentage,
  resetTimeout,
}, action) => {
  const STATE = {
    CLOSED: 'CLOSED',
    OPEN: 'OPEN',
  }

  let callCount = 0
  let errorCount = 0

  const CACHE_KEY = `CIRCUIT_BREAKER.${name}`

  const getState = async () => {
    console.log('CACHE: GET ', CACHE_KEY)
    const state = await redis.get(CACHE_KEY)
    const currentState = state ?? STATE.CLOSED
    console.log(`CACHE: got ${currentState}`)
    return currentState
  }

  const setState = (newState, ttl) => {
    console.log(`CACHE: SET ${CACHE_KEY} ${newState}`)
    return ttl
      ? redis.set(CACHE_KEY, newState, 'EX', Math.round(ttl / 1000))
      : redis.set(CACHE_KEY, newState)
    }

  const threshold = () =>
    callCount <= 0
      ? 0
      : (errorCount / callCount)

  const shouldOpenCircuit = () => {
    const t = threshold()
    console.log(`CB: error threshold at ${t}.`)
    return t > errorThresholdPercentage
  }

  const incrementErrorCount = () =>
    errorCount += 1

  const incrementCallCount = () =>
    callCount += 1

  const isOpen = async () =>
    (await getState()) === STATE.OPEN

  const resetInternalState = () => {
    callCount = 0
    errorCount = 0
  }

  // const closeCircuit = async () => {
  //   await setState(STATE.CLOSED)
  //   resetInternalState()
  // }

  const openCircuit = async () => {
    await setState(STATE.OPEN, resetTimeout)
    resetInternalState()
  }

  const raiseCircuitOpen = () => {
    const error = new Error('Circuit is open')
    error.name = 'CIRCUIT_BREAKER_OPEN'
    return Promise.reject(error)
  }

  const handleActionError = async error => {
    console.log('CB: Incrementing error count')

    incrementErrorCount()

    if (shouldOpenCircuit()) {
      console.log('CB: opening circuit.')
      await openCircuit()
      return raiseCircuitOpen()
    }

    return Promise.reject(error)
  }

  const fire = async (...args) => {
    console.log('callCount:', callCount, 'errorCount:', errorCount)

    const open = await isOpen()

    if (open) {
      console.log('CB: circuit is OPEN. Rejecting immediately.')
      return raiseCircuitOpen()
    }

    incrementCallCount()

    console.log('CB: circuit is CLOSED. Calling action.')

    return action(...args)
      .catch(handleActionError)
  }

  return {
    fire,
  }
}

const rejectAsError = message =>
  Promise.reject(new Error(message))

const callServer = () =>
  fetch(process.env.SERVER_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => response.ok
    ? response.json()
    : response.text().then(rejectAsError)
  )

const getServerCommand = CircuitBreaker(
  {
    name: 'server_integration',
    resetTimeout: 30_000,
    errorThresholdPercentage: 0.1,
  },
  callServer
)

const handler = ctx =>
  getServerCommand
    .fire()
    .then(x => (ctx.body = x))
    .catch(err => {
      ctx.status = 500
      ctx.body = { error: err.message }
    })

const app = new Koa()
const router = new Router()
const port = process.env.PORT
const service = process.env.SERVICE_NAME

router.get('/api', handler)
app.use(bodyParser())
app.use(router.routes())
app.listen(port)
  .once('listening', () =>
    console.log(`${service} listening on port ${port}`)
  )
  .once('error', error => {
    console.error(service, error)
    process.exit(1)
  })




