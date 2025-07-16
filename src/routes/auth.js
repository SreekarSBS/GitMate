const express = require('express')
const bcrypt = require("bcrypt")
const authRouter = express.Router()
const User = require("../models/user")
const cookies=  require("cookies")
const { validate } = require("../utils/validate")
const { userAuth } = require('../middlewares/auth')


authRouter.post("/status",async(req,res) => {
    // Find if the user is in the database or not , but how
    try{
    const userEmailId = req.body.emailId;
    console.log(userEmailId);
    
    if(!userEmailId) throw new Error("Email Id invalid")
        // No need to validate the emailId again , if at all it is present in the Databaase just return it.
    const isEmailPresent = await User.find({emailId : userEmailId})
    console.log(isEmailPresent)
    if(!isEmailPresent || isEmailPresent.length === 0) res.send(false)
    else res.send(true)
    }catch(err){
        res.status(401).send("Status Check Failed : " + err.message)
}
    
})


authRouter.post("/login", async(req,res) => {
    try {
        // if(req.user) throw new Error("Please logout " + req.user.firstName + " to login again")
        if(!req.body.emailId || !req.body.password) throw new Error("Please enter valid credentials")
    const userDocument = await User.findOne({emailId : req.body.emailId})
    console.log(userDocument);
    if(!userDocument) throw new Error("User not found with this emailId")
       
    const {password} = userDocument;
    const isPasswordValid = await userDocument.validatePassword(req.body.password);

  
    if(isPasswordValid === false) throw new Error("Invalid Password")
        // create a jwt token and send it to the user
        const token = userDocument.getJWT()
        console.log(token);
        //we will wrap the jwt in a cookie and send it to the user
   
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // change to true only if you're using HTTPS
            sameSite: "Lax", // or "None" if frontend & backend are on different subdomains
            domain: "54.79.4.212",
            path: "/",
            maxAge: 8 * 60 * 60 * 1000
          });
          
         
        res.json({
            message : "Welcome Back " + userDocument.firstName,
            data : userDocument
        })
        // else throw new Error("Invalid Password")
    
    }catch(err){
        res.status(400).send("Login failed: " + err.message)}
})


authRouter.post("/signup" , async(req , res) => {
    //Validating the request body
        
try {
    validate(req)
    // Encrypting Passwords
        const passwordHash = await bcrypt.hash(req.body.password, 10) 
        const {
            firstName,
            lastName,
            emailId, 
            gender,
            photoURL,
            age,
            skills,
            about,
            location
          } = req.body;  
          
          if(about === "")about = undefined
    // Creating an instance of a model .
    //Posting the req.body direct to the database
    const users = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        gender,
        photoURL,
        age,
        skills,
        about,
        location
      });


 const savedUser  = await users.save()
 const token = savedUser.getJWT()
 console.log(token);
 //we will wrap the jwt in a cookie and send it to the user

 res.cookie("token", token, {
    httpOnly: true,
    secure: false, // change to true only if you're using HTTPS
    sameSite: "Lax", // or "None" if frontend & backend are on different subdomains
    domain: "54.79.4.212",
    path: "/",
    maxAge: 8 * 60 * 60 * 1000
  });
  
res.json({
    message :"User added successfully !",
    data : savedUser
})
} catch(err){
    res.status(400).send("Error:" + err.message)
}
})

authRouter.post("/logout",(req,res) => {
    res.cookie("token",null,{domain: "54.79.4.212",expires : new Date(Date.now())}).send("Logged out successfully")
})



module.exports = {
    authRouter
}