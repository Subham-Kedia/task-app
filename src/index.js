const express = require("express")

const app = express()
const PORT = process.env.PORT || 3000

console.log(process.env.NODE_ENV)

app.get("/", (req, res) => {
    res.send("WELCOME TO HELL" + process.env.NODE_ENV)
})

module.exports = app


// app.listen(PORT, () => {
//     console.log(`Server is running on PORT ${PORT}`)
// })