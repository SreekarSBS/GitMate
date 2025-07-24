const express = require('express')
const bcrypt = require('bcrypt');
const profileRouter = express.Router()
const { userAuth } = require("../middlewares/auth");
const User = require('../models/user');
const { validateUserUpdateRequest } = require('../utils/validate');

profileRouter.get("/profile/view/:targetUserId",userAuth,async(req,res) => {
    try{
        const {targetUserId} = req.params
        if(!req.user) res.status(401).send("Please Login to continue")
            console.log(req.user);
        if(!targetUserId) res.status(401).send("User not found")
            console.log(req.user);
        
        const targetUser = await User.findById(targetUserId)
        if(!targetUser) throw new Error(" targetUser not present in DB")

    res.json({
        message : "Welcome Back " + targetUser.firstName,
      data:  targetUser
    })
} catch(err) { 
    res.status(400).send("Profile operation failed " + err.message)
    }
})

profileRouter.get("/profile/view/",userAuth,async(req,res) => {
    try{
       
        if(!req.user) res.status(401).send("Please Login to continue")
            console.log(req.user);
        
        
        

    res.json({
        message : "Welcome Back " + req.user.firstName,
      data:  req.user
    })
} catch(err) { 
    res.status(400).send("Profile operation failed " + err.message)
    }
})

profileRouter.get("/profile/view/:userId",userAuth,async(req,res) => {
    try{
        
        if(!req.user) return res.status(401).send("User not found")
            console.log(req.user);
        const userId = req.params.userId;
        if(!userId) throw new Error("User not found")
        const userDocument  =await User.findById({_id : userId})
        if(!userDocument) throw new Error ("User not found");
            
    res.json({
        message : "User found: " + userDocument.firstName,
      data:  userDocument
    })
} catch(err) { 
    res.status(400).send("Profile operation failed ")
    }
})


profileRouter.put("/profile/edit",userAuth,async(req,res) => {
    try {
       
       if(!validateUserUpdateRequest(req)){
        throw new Error("Invalid update request")
       }
       const loggedInUser = req.user ;

       Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
     console.log("Updated user data: ", loggedInUser);
     

     await loggedInUser.save()
     res.json({
        message : "Profile updated successfully",
        data : loggedInUser
     })
    } catch(err){
       return res.status(400).send("Profile update failed : " + err.message)
    }

})

profileRouter.patch("/profile/password",userAuth,async(req,res) => {
    try{
        const loggedInUser = req.user;
        const {currentPassword , newPassword} = req.body;
        if(!currentPassword || !newPassword) {
            throw new Error("Please provide both current and new passwords");
        }
       const isPasswordValid = await loggedInUser.validatePassword(currentPassword);
        if(!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = hashedPassword;
        await loggedInUser.save()
        res.json({
            message : "password changed successfullyn ",
            data : 
                loggedInUser
            
        })
    }
    catch(err) {
        res.status(400).send("Profile password update failed : " + err.message)
    }
})


module.exports = {
    profileRouter
}