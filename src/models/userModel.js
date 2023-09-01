const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { isEmail } = require("validator")
require("dotenv").config()
const Task = require("./taskModel")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!isEmail(value)) {
          throw new Error("Invalid Email")
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
    },
    avatar: {
      type: Buffer,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.__v
  if (userObject.avatar) {
    delete userObject.avatar
    userObject.avatar = `${process.env.HOST_URL}/users/${userObject._id}/profileImage`
  }

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error("No user with this email id exist")
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error("Invalid Password!")
  return user
}

userSchema.pre("save", async function (next) {
  const user = this
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
  }
)

const User = mongoose.model("User", userSchema)

module.exports = User
