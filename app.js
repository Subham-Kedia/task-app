const express = require("express")

const app = express()
const PORT = process.env.PORT || 3000


app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.get("/about", (req, res) => {
    res.send("this is a about page")
})

app.get("/pricing", (req, res) => {
    res.send("this is a pricing page")
})



app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})