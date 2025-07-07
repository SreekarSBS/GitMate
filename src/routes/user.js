const express = require("express")
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { rawListeners } = require("../models/user");

const userRouter = express.Router()

// get all the pending requests from the users
userRouter.get("/user/requests/received",userAuth,async(req,res) => {
    try{
    const loggedInUser = req.user;

    const connectionrequest = await ConnectionRequest.find({
        toUserId : loggedInUser._id,
        status : "interested"
    }).populate("fromUserId" , "firstName lastName")
       if(!connectionrequest || connectionrequest.length == 0) throw new Error ("No connection requests found for the user " + loggedInUser.firstName) 
        res.json({
            message : "Successfully fetched the connection requests received",
            data : connectionrequest
        })
    }catch(err){
        res.status(401).json({
        message : "Failed to fetch the requests " + err.message
        })
    }
})

userRouter.get("/user/connections",userAuth,async(req,res) => {
    try {
    const loggedInUser = req.user
    if(!loggedInUser) throw new Error("Please Login to continue")
    // Find all the connections inwhich toUserId is mine , and status is accepted

    const connectionrequests = await ConnectionRequest.find({
        
        $or : [
            {fromUserId : loggedInUser._id , status : "accepted"},
            {toUserId : loggedInUser._id , status : "accepted"}
        ]
        
    }).populate("toUserId", "firstName lastName").populate("fromUserId", "firstName lastName")
    
      if(!connectionrequests || connectionrequests.length === 0) throw new Error("No connections found for the user " + loggedInUser.firstName)
    
      
        res.json({
            message : "Successfully fetched the connections",
            data : connectionrequests
        })
           

} catch(err){
    res.status(401).json({
        message : "Failed to fetch the connections " + err.message
    })
}
})

module.exports = {
    userRouter
}