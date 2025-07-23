const express = require('express')
const chatRouter = express.Router()
const {userAuth} = require("../middlewares/auth")
const Chat = require("../models/chat")

chatRouter.get("/chats/:targetUserId",userAuth ,async(req,res) => {
    try{
    const userId  =req.user._id
    const {targetUserId} = req.params

    if(!userId) throw new Error("Please Login to Continue")
    if(!targetUserId) throw new Error("Please Enter a valid user to form a connection with")

    let chats = await Chat.findOne({participants: { $all :[userId,targetUserId]} }).populate({
        path : "messages.senderId",
        select :"firstName lastName photoURL"
    })
    if(!chats){
        chats = new Chat({
            participants : [userId,targetUserId],
            messages : []
        })
        await chat.save()
    }

    console.log(chats);

    res.json({
        message : "Chats Fetched Successfully",
        data : chats
    })
    


    }catch(err){
        res.status(401).send("Failed to fetch chats for " + err)
    }
})

module.exports = {chatRouter}