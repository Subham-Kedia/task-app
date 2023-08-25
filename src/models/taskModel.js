const mongoose = require("mongoose")

const Task = mongoose.model("User", {
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
})

module.exports = { Task }
