const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const logger = require('./logger')

const loggingMiddleware = async (ctx, next) => {
  const start = Date.now()
  logger.info(`Received request ${ctx.request.method} ${ctx.request.path}`)
  await next()
  logger.info(`Responded request ${ctx.request.method} ${ctx.request.path}. Took ${Date.now() - start}ms`)
}

const errorMiddleware = (ctx, next) =>
  next()
    .catch(error => {
      logger.error(error)
      ctx.status = 500
      ctx.body = {
        statusCode: 500,
        error: error.message,
        code: 'INTERNAL_SERVER_ERROR'
      }
    })

const startServer = (router, prefix, port) => {
  const app = new Koa()
  const prefixRouter = new Router()

  app.use(bodyParser())
  prefixRouter.use(loggingMiddleware)
  prefixRouter.use(errorMiddleware)
  prefixRouter.use(prefix, router.routes())
  app.use(errorMiddleware)
  app.use(prefixRouter.routes())

  return app.listen(port)
    .on('listening', () => logger.info(`Service listening on port ${port}`))
    .once('error', () => {
      logger.error('Uncaught server error. Terminating process')
      process.exit(1)
    })

}

module.exports = {
  startServer,
}
