// import express module from node_modules
const express = require("express")
// create a server
const app = express()

app.use("/home", (req,res) => {
    res.send("Hello from the home page")
})

//listen for requests
app.listen(3000,() => {
    console.log("Listening from Server port 3000");
})