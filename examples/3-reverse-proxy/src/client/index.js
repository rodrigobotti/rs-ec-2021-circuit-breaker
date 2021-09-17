const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const fetch = require('node-fetch')

const rejectAsError = message =>
  Promise.reject(new Error(message))

const callServer = () =>
  fetch(process.env.BACKEND_SERVICE_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => response.ok
    ? response.json()
    : response.text().then(rejectAsError)
  )

const handler = ctx =>
  callServer()
    .then(res => (ctx.body = res))
    .catch(error => {
      ctx.status = 500
      ctx.body = { error: error.message }
    })

const app = new Koa()
const router = new Router()

const port = process.env.PORT
const service = process.env.SERVICE_NAME

router.get('/api', handler)
app.use(bodyParser())
app.use(router.routes())
app.listen(port)
  .once('listening', () => console.log(`${service} listening on port ${port}.`))
  .once('error', error => {
    console.error(service, error)
    process.exit(1)
  })
