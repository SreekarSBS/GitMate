const express = require("express")
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res) =>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status  = req.params.status
        const validStatuses = ["ignored", 'interested'];
        if(!validStatuses.includes(status)) throw new Error ("Please provide some status Invalid : " + status)
            const toUserDocument = await User.findById(toUserId)
        if(!toUserDocument._id) throw new Error ("Invalid User ID")
        //Create a new instance of the connectionRequestModel 
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const isAlreadyRequested = await ConnectionRequest.findOne({toUserId,fromUserId})
        if(isAlreadyRequested) throw new Error("Connection Request already sent to this user")
        const resMessage  = status == "interested" && "Connection Request Sent successfully to "
        || status == "ignored" && "Connection Request Ignored successfully from "

        const data = await connectionRequest.save();
        res.json({
            message : resMessage + toUserDocument.firstName,
            data : data
        })
    }catch(err){
        res.status(400).send("Failed to send a connection Request : " + err.message)
    }
})

module.exports = {requestRouter}