
const express = require("express")

const app = express()
const ConnectDB = require("./config/database")
const User = require("./models/user")

// We want to fetch the data from the api (POST) through Postman , we need to parse it to JS Object
app.use(express.json())

app.post("/signup" , async(req , res) => {
     const users = new User(req.body)
    
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



