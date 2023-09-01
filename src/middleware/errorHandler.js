const mongoose = require("mongoose")
const httpStatus = require("http-status")

class BaseError extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

const handleError = (err, res) => {
  const { statusCode, message } = err
  res.status(statusCode).send({
    status: "failed",
    data: {},
    message,
  })
}

const convertToApiError = (err, req, res, next) => {
  let error = err
  if (!(error instanceof BaseError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR
    const message = error.message || httpStatus[statusCode]
    error = new BaseError(statusCode, message)
  }
  next(error)
}

module.exports = { BaseError, handleError, convertToApiError }
