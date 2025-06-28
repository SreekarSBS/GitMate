// import express module from node_modules
const express = require("express")
// create a server
const app = express()
// app.use("/hello/api",(req,res) => {
//     res.send("Hello Sreekar")
// })

// app.get("/user",(req,res) => {
//     res.send("Got the data from the server")
// })
const ch = "*"
app.get("/jo" + ch + "d",(req,res) => {
    res.send("Jod bey")
})

app.get("/user/:userId/:userName/:password",(req,res) => {
    console.log(req.params);
    
    res.send("head travis or what")
})

app.get("/*fly$/",(req,res) => {

    
    res.send("butter fly ")
})

app.get("/user",(req,res) => {
    console.log(req.query);
    
    res.send("head repeat or what")
})

// app.post("/user",(req,res) => {
//     res.send({ firstName : "Sreekar" , lastName : "SBS" })
// })

// app.put("/user",(req,res) => {
//     res.send({firstName : "Sanakkayala"})
// })

// app.patch("/user",(req,res) => {
//     res.send({lastName:"Bhaskara Sai"})
// })

// app.delete("/user",(req,res) => {
//     res.send("We dont do that here.")
// })

// app.use("/hello/hello", (req,res) => {
//     res.send("Hello from the home page")
// })

// app.use("/test", (req,res) => {
//     res.send("Hello from the test route handler")
// })





//listen for requests
app.listen(3000,() => {
    console.log("Listening from Server port 3000");
})