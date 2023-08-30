const express = require("express")
// require("./db/mongoose")
// const routers = require("./routers")
// const mongoose = require("mongoose")

require("dotenv").config()

const connectionURL = `mongodb+srv://${process.env.MONGODB_HOST}:${process.env.MONGODB_PASSWORD}@cluster0.ei6okkf.mongodb.net/?retryWrites=true&w=majority`

// const connect = async () => {
//   try {
//     await mongoose.connect(connectionURL, { dbName: "test" })
//     console.log("mongoose connected successfully")
//   } catch (err) {
//     console.log("ERROR-mongoose_connection:", err)
//   }
// }

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.get("/", (req, res) => {
  res.send("hello world")
})
// app.use(routers)

// connect()

module.exports = app

// only for local, for production serverless application for deployment at vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
  })
}
