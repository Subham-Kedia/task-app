const express = require("express")
const taskRouter = new express.Router()
const auth = require("../middleware/auth")
const Task = require("../models/taskModel")

taskRouter.get("/getAll", auth, async (req, res) => {
  const { status, skip, limit, sortField, sortOrder } = req.query

  const match = {}
  if (status) match.status = status === "true"

  const options = {}
  if (!isNaN(parseInt(limit))) options.limit = parseInt(limit)
  if (!isNaN(parseInt(skip))) options.skip = parseInt(skip)

  if (sortField && sortOrder) {
    const sort = {
      [sortField]: parseInt(sortOrder),
    }
    options.sort = sort
  }

  try {
    await req.user.populate({
      path: "tasks",
      match,
      options,
    })
    res
      .status(200)
      .send({ tasks: req.user.tasks, message: "Task Fetched Successfully" })
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
})

taskRouter.post("/create", auth, async (req, res) => {
  const { title, description, status } = req.body
  if (title && description && status !== undefined) {
    try {
      const task = new Task({ title, description, status, owner: req.user._id })
      const result = await task.save()
      res.status(201).send(result)
    } catch (err) {
      res.status(400).send(err.message)
    }
  } else {
    res.status(400).send({ message: "malformed request" })
  }
})

taskRouter.put("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ["description", "status", "title"]
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) res.status(400).send({ message: "invalid Request" })
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    updates.forEach((update) => {
      task[update] = req.body[update]
    })
    await task.save()
    res.status(200).send({ task, message: "task updated successfully" })
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
})

taskRouter.get("/getInfo", auth, async (req, res) => {
  const _id = req.query.id
  if (_id) {
    try {
      const result = await Task.findOne({ _id, owner: req.user._id })
      if (!result) res.status(404).send({ message: "No Such Task Exist" })
      res.status(200).send(result)
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  } else {
    res.status(400).send({ message: "malformed request" })
  }
})

taskRouter.delete("/delete", auth, async (req, res) => {
  const _id = req.body.id
  if (_id) {
    try {
      const task = await Task.findOne({ _id, owner: req.user._id })
      if (!task) res.status(404).send({ message: "No Such Task Exist" })
      const result = await Task.deleteOne({ _id: task._id })
      res.status(200).send({ id: task._id, message: "Task Deleted" })
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  } else {
    res.status(400).send({ message: "malformed request" })
  }
})

module.exports = taskRouter
