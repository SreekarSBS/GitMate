const express = require('express')
const bcrypt = require("bcrypt")
const authRouter = express.Router()
const User = require("../models/user")
const cookies=  require("cookies")
const { validate } = require("../utils/validate")

authRouter.post("/logout", async(req,res) => {
    res.cookie("token",null).send("Logged out successfully")
})


authRouter.post("/login",async(req,res) => {
    try {
    const userDocument = await User.findOne({emailId : req.body.emailId})
    console.log(userDocument);
    
       
    const {password} = userDocument;
    const isPasswordValid = await userDocument.validatePassword(req.body.password)
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


authRouter.post("/signup" , async(req , res) => {
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



module.exports = {
    authRouter
}