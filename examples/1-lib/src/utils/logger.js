const pino = require('pino')

module.exports = pino({
  name: process.env.SERVICE_NAME,
  prettyPrint: true,
  level: 'debug',
})
