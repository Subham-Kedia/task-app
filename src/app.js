const express = require("express")

require("./db/mongoose")
const routers = require("./routers")
const { handleError, convertToApiError } = require("./middleware/errorHandler")

const app = express()

app.use(express.json())
app.use(routers)
app.use(convertToApiError)
app.use((err, req, res, next) => {
  handleError(err, res)
})

module.exports = app


