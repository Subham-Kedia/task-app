const mongoose = require("mongoose")

require("dotenv").config()

const connectionURL = `mongodb+srv://${process.env.MONGODB_HOST}:${process.env.MONGODB_PASSWORD}@cluster0.ei6okkf.mongodb.net/?retryWrites=true&w=majority`

const connect = async () => {
  try {
    console.log(connectionURL)
    await mongoose.connect(connectionURL, { dbName: "test" })
    console.log("mongoose connected")
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = connect
