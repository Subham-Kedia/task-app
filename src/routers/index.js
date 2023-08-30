const express = require("express")
const userRouter = require("./userRoutes")
const taskRouter = require("./taskRoutes")

const routers = express.Router()

routers.get("/", (req, res) => {
  res.send("Hello World")
})
// routers.use("/users", userRouter)
// routers.use("/tasks", taskRouter)

module.exports = routers
