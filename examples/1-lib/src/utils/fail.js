const failWhen = percentage => () =>
  Math.random() < percentage
    ? Promise.reject(new Error('Failed'))
    : Promise.resolve()

module.exports = {
  failWhen,
}
