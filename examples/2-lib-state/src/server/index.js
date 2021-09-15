const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const faker = require('faker/locale/pt_BR')

const app = new Koa()
const router = new Router()
const port = process.env.PORT
const service = process.env.SERVICE_NAME

router.get('/api', ctx => (ctx.body = { name: faker.name.findName() }))
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
