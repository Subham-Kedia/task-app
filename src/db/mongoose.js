const mongoose = require("mongoose")

require("dotenv").config()

const connectionURL = `mongodb+srv://${process.env.MONGODB_HOST}:${process.env.MONGODB_PASSWORD}@cluster0.ei6okkf.mongodb.net/?retryWrites=true&w=majority`

const connect = async () => {
  try {
    await mongoose.connect(connectionURL, { dbName: "taskManager" })
    console.log("mongoose connected successfully")
  } catch (err) {
    console.log("ERROR-mongoose_connection:", err)
  }
}

connect()
