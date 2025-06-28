// import express module from node_modules
const express = require("express")
// create a server
const app = express()


app.use("/hello/api",(req,res) => {
    res.send("Hello Sreekar")
})

app.get("/user",(req,res) => {
    res.send("Got the data from the server")
})

app.post("/user",(req,res) => {
    res.send({ firstName : "Sreekar" , lastName : "SBS" })
})

app.put("/user",(req,res) => {
    res.send({firstName : "Sanakkayala"})
})

app.patch("/user",(req,res) => {
    res.send({lastName:"Bhaskara Sai"})
})

app.delete("/user",(req,res) => {
    res.send("We dont do that here.")
})

app.use("/hello/hello", (req,res) => {
    res.send("Hello from the home page")
})

app.use("/test", (req,res) => {
    res.send("Hello from the test route handler")
})





//listen for requests
app.listen(3000,() => {
    console.log("Listening from Server port 3000");
})