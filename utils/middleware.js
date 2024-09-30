const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info(`Method: ${request.method}`)
  logger.info(`Path: ${request.path}`)
  logger.info(`Headers: ${JSON.stringify(request.headers)}`)
  logger.info(`Body: ${JSON.stringify(request.body)}`)
  logger.info(`---`)
  next()
}

module.exports = requestLogger