const express = require("express")
// const {adminAuth, userAuth}  = require("./middlewares/auth")
const app = express()





// app.use("/admin",adminAuth)

// app.get("/user",(req,res) => {
//     res.send("user route accessed before authentication")
// })
// app.get("/getData",(req,res) => {
//     throw new Error("w4esfd");
//     res.send("user data accessed after authentication")
// })
// app.use("/",(err,req,res,next) => {
//     if(err) {
//         res.status(500).send("Hello  ,.there is something wrong in your app")
//     }
// })

// app.get("/user",userAuth,(req,res) => {
 
//         throw new Error("w4esfd");
 
//     res.send("user data accessed after authentication")
    
// })


// app.get("/admin/getData",(req,res) => {
//     res.send("All data sent from getData")
// })

// app.get("/admin/deleteUser",(req,res) => {
//     res.send("Deleted User")
// })


app.listen(7777,(req,res) => {
    console.log("Server listening to port 7777");
})