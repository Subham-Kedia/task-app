const express = require("express")
const userRouter = new express.Router()
const User = require("../models/userModel")
const auth = require("../middleware/auth")

userRouter.post("/signup", async (req, res) => {
  const { email, name, password } = req.body
  if (name && email && password) {
    try {
      const user = new User({ name, email, password })
      await user.save()
      const token = await user.generateAuthToken()
      res
        .status(200)
        .send({ user, token, message: "Successfully created User" })
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  } else res.status(400).send({ message: "Details Missing" })
})

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body
  if (email && password) {
    try {
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
      )
      const token = await user.generateAuthToken()
      res.status(200).send({ user, token })
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  } else res.status(400).send({ message: "Credentials Missing" })
})

userRouter.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    )
    await req.user.save()

    res.status(200).send({ message: "successfully logged out" })
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
})

userRouter.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ["name", "password"]
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) res.status(400).send({ message: "Invalid Request" })

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update]
    })
    const result = await req.user.save()
    res
      .status(200)
      .send({ user: req.user, message: "user updated successfully" })
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
})

userRouter.get("/getProfile", auth, async (req, res) => {
  try {
    res.status(200).send({ user: req.user, message: "User Profile" })
  } catch (err) {
    res.status(400).send(err.message)
  }
})

userRouter.delete("/delete", auth, async (req, res) => {
  try {
    await req.user.deleteOne()
    res
      .status(200)
      .send({ id: req.user._id, message: "User deleted successfully" })
  } catch (err) {
    res.status(400).send(err.message)
  }
})

module.exports = userRouter
