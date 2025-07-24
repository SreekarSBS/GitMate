const express = require("express")
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { rawListeners } = require("../models/user");
const User = require("../models/user");

const userRouter = express.Router()
const USER_SAFE_DATA = "firstName lastName photoURL age gender about skills location"
// get all the pending requests from the users
userRouter.get("/user/requests/received",userAuth,async(req,res) => {
    try{
    const loggedInUser = req.user;

    const connectionrequest = await ConnectionRequest.find({
        toUserId : loggedInUser._id,
        status : "interested"
    }).populate("fromUserId" , USER_SAFE_DATA)
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
            {fromUserId : loggedInUser._id , status : "accepted"} ,
            {toUserId : loggedInUser._id , status : "accepted"}
        ]
        
    }).populate("toUserId", USER_SAFE_DATA).populate("fromUserId", USER_SAFE_DATA)

      if(!connectionrequests || connectionrequests.length === 0) throw new Error("No connections found for the user " + loggedInUser.firstName)
    

      const filteredConnections = connectionrequests.map((row) => {
        if(row.toUserId._id.equals(loggedInUser._id)) return row.fromUserId
        else return row.toUserId
      })
        res.json({
            message : "Successfully fetched the connections",
            data : filteredConnections
        })
           

} catch(err){
    res.json({
        message : "Failed to fetch the connections " + err.message
    })
}
})

userRouter.get("/user/feed",userAuth ,async(req,res) => {
    try {
    const loggedInUser = req.user 
    if(!loggedInUser) throw new Error ("Please Login to continue ")
     
    let limit= parseInt(req.query.limit) || 10
    limit = limit > 50 ? 50 : limit
    const page = parseInt(req.query.page) || 1
    const skip = (page-1)*limit

    const notFeedData = await ConnectionRequest.find({
        $or : [
          { fromUserId : loggedInUser._id },
          { toUserId : loggedInUser._id }
        ]
    }).select("fromUserId toUserId" )
   
    const filteredConnections = new Set()
    notFeedData.forEach(req => {
       if(req.fromUserId) filteredConnections.add(req.fromUserId.toString())
       if(req.toUserId) filteredConnections.add(req.toUserId.toString())
    });

    
    
     const feedData = await User.find({
       $and : [
        {_id : {$nin : Array.from(filteredConnections)}},
        {_id :{ $ne : loggedInUser._id } }
       ]
     }).select(USER_SAFE_DATA).skip(skip).limit(limit)
    
    // We have to find the user cards in which the connection requests of toUserId and fromuserId must not be of the loggedInUser
    // Find in users - ids that are not in notFeedData.

   
    res.json({
        message : "Successfully fetched the Cards for " + loggedInUser.firstName,
        data : feedData
})


    }catch(err){
        res.status(401).send("Failed to fetch the Feed : " + err.message )
}
})

module.exports = {
    userRouter 
}