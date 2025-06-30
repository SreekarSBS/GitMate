
const express = require("express")

const app = express()
const ConnectDB = require("./config/database")
const User = require("./models/user")


app.post("/signup" , async(req , res) => {
    const users = new User({
    firstName :  "Rick",
    lastName : "Grimes",
    emailId : "Rick@email",
    password : "GrimesUI",
    gender : "M"
})
try {
await users.save()
res.send("User added successfully !")
} catch(err){
    res.status(400).send("Something Went wrong")
}
})



ConnectDB().then(() => {
    console.log("Connection estabilished");
    app.listen(3000,() => {
    console.log("Listening from Server port 3000");
})
   }).catch(err => {
   console.log("Database Connection failed ");
   
   })



