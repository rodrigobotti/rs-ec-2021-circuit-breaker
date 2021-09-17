const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const faker = require('faker/locale/pt_BR')

const handler = ctx => {
  const [status, body] = process.env.FORCE_ERROR === 'true'
    ? [503, { error: 'Forced error' }]
    : [200, { job: `${faker.name.jobTitle()} ${faker.name.jobDescriptor()}` }]

  ctx.status = status
  ctx.body = body
}

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
