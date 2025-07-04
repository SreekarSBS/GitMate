
const express = require("express")
const bcrypt = require("bcrypt")
const app = express()
const ConnectDB = require("./config/database")
const User = require("./models/user")
const { validate } = require("./utils/validate")
const cookies=  require("cookies")
const cookieParser = require("cookie-parser")
var jwt = require('jsonwebtoken');
const { userAuth } = require("./middlewares/auth")
// We want to fetch the data from the api (POST) through Postman , we need to parse it to JS Object
app.use(express.json())
app.use(cookieParser())



app.get("/user", async (req,res) => {
    const userEmailId = req.body.emailId
try{
    const userDocument = await User.find({emailId : userEmailId})
    if(userDocument.length === 0 ) return res.status(404).send("User not found")
    res.send(userDocument)
}catch(err){
    res.status(400).send("Something went wrong")
}
})

app.get("/feed", async(req,res) => {
    try{
    const allUserDocuments = await User.findByIdAndUpdate({})
    res.send(allUserDocuments)
    } catch(err){
        res.status(400).send("Something went wrong")
    }
})

app.delete("/user", async(req,res) => {
    try{
    const userId = req.body.userId;
    if(!userId) return res.status(400).send("User ID is required")
    await User.findByIdAndDelete(userId);
res.send("User deleted successfully")
    } catch(err) {
        res.status(400).send("Delete operation failed")
    }
})

// app.patch("/user", async(req,res) => {
//     try{
//         const userDocument = req.body;
//         if(!userDocument.userId) return res.status(400).send("User ID is required")
//         const updatedData = await User.findByIdAndUpdate(userDocument.userId,userDocument);
//         res.send("User updated successfully ",updatedData)
//     }   catch(err) {   
//         res.status(400).send("Update operation failed")
//     }
// })

app.patch("/user/:emailId", async(req,res) => {
   try {
    const userDocument = req.body;
    const emailId = req.params?.emailId
    const ALLOWED_UPDATES = [
        "firstName",
        "lastName",
        "age",
        'photoURL',
        'password'
    ]
    if(!Object.keys(userDocument).every(k => ALLOWED_UPDATES.includes(k))) throw new Error("Invalid update fields")


    if(!emailId) return res.status(404).send("User not found")
    const updatedData = await User.findOneAndUpdate({emailId :emailId},req.body,{ returnDocument: 'after'  , runValidators: true});
    console.log(updatedData);
    
    res.send("User updated successfully ", updatedData)
    } catch(err) {
        res.status(400).send("Update operation failed " + err.message)
    }
})

app.post("/profile",userAuth,async(req,res) => {
    try{
   console.log("req.user");
   
    res.send(req.usersew)
} catch(err) { 
    res.status(400).send("Profile operation failed ")
    }
})

app.post("/login",async(req,res) => {
    try {
    const userDocument = await User.findOne({emailId : req.body.emailId})
    console.log(userDocument);
    
       
    const {password} = userDocument;
    const isPasswordValid = userDocument.validatePassword(req.body.password)
    if(isPasswordValid){
        // create a jwt token and send it to the user
        const token = await userDocument.getJWT()
        console.log(token);
        //we will wrap the jwt in a cookie and send it to the user
   
         res.cookie("token",token)
         res.send("Welcome Back " + userDocument.firstName)
    }
        else throw new Error("Invalid Password")
    
    }catch(err){
        res.status(400).send("Login failed: " + err.message)}
})


app.post("/signup" , async(req , res) => {
    //Validating the request body
        
try {
    validate(req)
    // Encrypting Passwords
        const passwordHash = await bcrypt.hash(req.body.password, 10) 
        const { firstName, lastName, emailId } = req.body;
    // Creating an instance of a model .
    //Posting the req.body direct to the database
     const users = new User({
        firstName,
        lastName,
        emailId,
        password : passwordHash
     })


await users.save()
res.send("User added successfully !")
} catch(err){
    res.status(400).send("Error:" + err.message)
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



