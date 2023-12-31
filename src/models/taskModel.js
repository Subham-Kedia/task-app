const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    trim: true,
    lowercase: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
},{
  timestamps: true
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task
