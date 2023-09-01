const express = require("express")
require("dotenv").config()
require("./db/mongoose")
const routers = require("./routers")
const { handleError, convertToApiError } = require("./middleware/errorHandler")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(routers)
app.use(convertToApiError)
app.use((err, req, res, next) => {
  handleError(err, res)
})

module.exports = app

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})
