const request = require("supertest")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const app = require("../src/app")
const User = require("../src/models/userModel")

const userId = new mongoose.Types.ObjectId()

const user = {
  _id: userId,
  name: "Shubham",
  email: "testing@gmail.com",
  password: "testing@123",
  tokens: [
    {
      token: jwt.sign({ _id: userId }, process.env.JWT_SECRET),
    },
  ],
}

beforeEach(async () => {
  await User.deleteMany() // removing all users before testing
  await User(user).save() // adding this user for testing
})

//testing signup
test("should signup user", async () => {
  const user = {
    name: "Shubham",
    email: "shubhamked@gmail.com",
    password: "adfjkasd@434df",
  }
  const response = await request(app)
    .post("/users/signup")
    .send(user)
    .expect(201)

  // Assertion about database changes
  const res = await User.findById(response.body.user._id)
  expect(res).not.toBeNull()

  // Assertion about response
  expect(response.body).toMatchObject({
    user: {
      name: user.name,
      email: user.email,
    },
    token: res.tokens[0].token,
  })
  // Testing whether plain password is stored or not
  expect(res.password).not.toBe(user.password)
})

// testing login
test("should login", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: user.email,
      password: user.password,
    })
    .expect(200)

  const result = await User.findById(response.body.user._id)
  expect(response.body.token).toBe(result.tokens[1].token)
})

// testing login with invalid credentials
test("should login", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: user.email,
      password: "wrongPassword",
    })
    .expect(400)
})

// get user profile
test("get user profile", async () => {
  await request(app)
    .get("/users/getProfile")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200)
})

// delete User
test("delete User", async () => {
  await request(app)
    .delete("/users/delete")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200)

    const result = await User.findById(userId)
    expect(result).toBeNull()
})

// 401 without token on delete
test("Invalid token", async () => {
  await request(app).delete("/users/delete").send().expect(401)
})
