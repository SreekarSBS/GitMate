const express = require('express')

const profileRouter = express.Router()
const { userAuth } = require("../middlewares/auth")

profileRouter.post("/profile",userAuth,async(req,res) => {
    try{
   console.log("req.user");
   
    res.send(req.usersew)
} catch(err) { 
    res.status(400).send("Profile operation failed ")
    }
})

module.exports = {
    profileRouter
}