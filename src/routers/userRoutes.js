const express = require("express")
const httpStatus = require("http-status")
const userRouter = new express.Router()
const User = require("../models/userModel")
const auth = require("../middleware/auth")
const upload = require("../middleware/upload")
const { BaseError } = require("../middleware/errorHandler")

userRouter.post("/signup", async (req, res) => {
  const { email, name, password } = req.body
  if (name && email && password) {
    try {
      const user = new User({ name, email, password })
      await user.save()
      const token = await user.generateAuthToken()
      res
        .status(201)
        .send({ user, token, message: "Successfully created User" })
    } catch (err) {
      throw new BaseError(httpStatus.BAD_REQUEST, err.message)
    }
  } else throw new BaseError(httpStatus.BAD_REQUEST, "Details Missing")
})

userRouter.post("/login", async (req, res, next) => {
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
      next(err)
    }
  } else throw new BaseError(httpStatus.BAD_REQUEST, "Invalid Credentials")
})

userRouter.get("/logout", auth, async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    )
    await req.user.save()

    res.status(200).send({ message: "successfully logged out" })
  } catch (err) {
    next(err)
  }
})

userRouter.patch("/:id", auth, async (req, res, next) => {
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
    await req.user.save()
    res
      .status(200)
      .send({ user: req.user, message: "user updated successfully" })
  } catch (err) {
    next(err)
  }
})

userRouter.get("/getProfile", auth, async (req, res, next) => {
  try {
    res.status(200).send({ user: req.user, message: "User Profile" })
  } catch (err) {
    next(err)
  }
})

userRouter.delete("/delete", auth, async (req, res, next) => {
  try {
    await req.user.deleteOne()
    res
      .status(200)
      .send({ id: req.user._id, message: "User deleted successfully" })
  } catch (err) {
    next(err)
  }
})

userRouter.post(
  "/upload",
  auth,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      req.user.avatar = req.file.buffer
      await req.user.save()
      res
        .status(200)
        .send({ user: req.user, message: "image uploaded successfully" })
    } catch (err) {
      next(err)
    }
  }
)

userRouter.get("/:id/profileImage", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar)
      throw new BaseError(httpStatus.NOT_FOUND, "image not found")
    res.set("Content-Type", "image/jpg")
    res.send(user.avatar)
  } catch (err) {
    next(err)
  }
})

module.exports = userRouter
