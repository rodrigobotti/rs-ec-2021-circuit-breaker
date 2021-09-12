const Router = require('koa-router')

const { startServer, delay } = require('../utils')

const ADDRESS = {
  addressLine1: '2181 Ana Luiza Rodovia',
  addressLine2: 'Apt. 657',
  state: 'SC',
  city: 'Silva do Descoberto',
  country: 'Brasil',
  zipCode: '52868-887',
}

const router = new Router()

const getAddress = ctx =>
  delay(parseInt(process.env.FORCED_DELAY || 100))
    .then(() => (ctx.body = ADDRESS))

router.get('/address', getAddress)

startServer(router, '/api', process.env.PORT)
