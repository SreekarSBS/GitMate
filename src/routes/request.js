const express = require("express")
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();
const sendEmail = require("../utils/ses_sendEmail")

requestRouter.post("/request/review/:status/:requestId", userAuth,async(req,res) => {
        // Validate the user , and status
        try{
            const fromUserId = req.user._id;
            const toUserId = req.params.requestId
            const sentStatus = req.params.status
             // Check if toUserId is valid or not
              const toUserDocument = await User.findById(toUserId)
            if(!toUserDocument) throw new Error ("Invalid User ID")
            if(toUserId == fromUserId) throw new Error ("You cannot review your own connection request")
            const validStatuses = ['accepted', 'rejected']
        if(!validStatuses.includes(sentStatus)) throw new Error ("The status provided is invalid , You can either accept or reject the request")
            // Check if the connection request exists
        
            const connectionRequest = await ConnectionRequest.findOne({
                fromUserId : toUserId,
                toUserId : fromUserId,
                status : "interested"
            })
            if(!connectionRequest) throw new Error ("Connection Request not found or already reviewed")
            // Update the status of the connection request
            connectionRequest.status = sentStatus;
            await connectionRequest.save()
            res.send("Successfully " + sentStatus + " the connection request from " + toUserDocument.firstName)
        }catch(err){
            res.status(401).json({
               message : "Unauthorized : " + err.message
               
            })
        }
})

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res) =>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status  = req.params.status
        if(fromUserId == toUserId) throw new Error ("You cannot send a connection request to yourself")
        const validStatuses = ["ignored", 'interested'];
        if(!validStatuses.includes(status)) throw new Error ("Please provide some status Invalid : " + status)
            const toUserDocument = await User.findById(toUserId)
        if(!toUserDocument) throw new Error ("Invalid User ID")
        //Create a new instance of the connectionRequestModel 
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const isAlreadyRequested = await ConnectionRequest.findOne(
           {
             $or :[
                {toUserId,fromUserId},
                {toUserId : fromUserId,fromUserId : toUserId},
            ],
        }
        )
        if(isAlreadyRequested) throw new Error("Connection Request already sent to this user")
        const resMessage  = status == "interested" && "Connection Request Sent successfully to "
        || status == "ignored" && "Connection Request Ignored successfully from "

        const resEmail =   status === "interested" && `🚀 ${req.user.firstName + " " + req.user.lastName} sent a Connection request to ${toUserDocument.firstName + " " + toUserDocument.lastName} `
        || status === "ignored" &&  `🥲 ${req.user.firstName + " " + req.user.lastName} ignored ${toUserDocument.firstName + " " + toUserDocument.lastName} `

        const data = await connectionRequest.save();
        const emailRes = await sendEmail.run(resEmail)
        console.log(emailRes);
        

        res.json({
            message : resMessage + toUserDocument.firstName,
            data : data
        })
    }catch(err){
        res.status(400).send("Failed to send a connection Request : " + err.message)
    }
})



module.exports = {requestRouter}