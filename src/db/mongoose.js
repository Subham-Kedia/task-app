const mongoose = require("mongoose")

const connectionURL = process.env.MONGODB_URL

const connect = async () => {
  try {
    await mongoose.connect(connectionURL)
    console.log("mongoose connected successfully")
  } catch (err) {
    console.log("ERROR-mongoose_connection:", err)
  }
}

connect()
