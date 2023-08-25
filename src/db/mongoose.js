const mongoose = require("mongoose")

const connectionURL =
  "mongodb+srv://Subham_Kedia:lic6dxocH7ykP5Jo@cluster0.ei6okkf.mongodb.net/?retryWrites=true&w=majority"

const connect = async () => {
  try {
    await mongoose.connect(connectionURL, { dbName: "test" })
    console.log("mongoose connected")
  } catch (err) {
    console.log(err)
  }
}

connect()
