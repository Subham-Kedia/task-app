const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const auth = async (req, res, next) => {
  const token = req?.headers?.authorization?.replace("Bearer", "")?.trim()
  if (token) {
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findOne({ _id: data._id, "tokens.token": token })

      if (!user) throw new Error("Invalid Token")
      req.user = user
      req.token = token
      next()
    } catch (err) {
      res.status(401).send({ message: err.message })
    }
  } else {
    res.status(401).send({ message: "token missing" })
  }
}

module.exports = auth
