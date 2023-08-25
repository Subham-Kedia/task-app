const express = require("express")
// const { Task } = require("./models/taskModel.js")
const connect = require("./db/mongoose.js")

const app = express()
const PORT = process.env.PORT || 3000

// connect()

app.get("/", (req, res) => {
    res.send("Welcome to Notes App")
})

// app.get("/tasks", (req, res) => {
//   Task.find()
//     .then((tasks) => {
//       res.send(tasks)
//     })
//     .catch((err) => {
//       res.status(500).send("Internal Server Error")
//     })
// })

// app.get("/tasks/:id", (req, res) => {
//   const id = req.params.id
//   Task.findById(id).then((task) => {
//     if (!task) {
//       return res.status(404).send()
//     }
//     res.send(task)
//   })
// })

module.exports = app

// only for local, for production serverless application for deployment at vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
  })
}
