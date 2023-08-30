const express = require("express")
require("./db/mongoose")
const routers = require("./routers")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(routers)

module.exports = app

// only for local, for production serverless application for deployment at vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
  })
}
