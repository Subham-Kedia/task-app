const express = require("express")
require("dotenv").config()
require("./db/mongoose")
const routers = require("./routers")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(routers)

module.exports = app

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})
