const express = require("express")
const path = require("path")
const userRouter = require("./userRoutes")
const taskRouter = require("./taskRoutes")

const routers = express.Router()

routers.get("/", (req, res) => {
  res.send("Welcome to Task APIs")
})
routers.use("/users", userRouter)
routers.use("/tasks", taskRouter)

module.exports = routers
