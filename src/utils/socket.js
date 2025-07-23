const socket = require("socket.io")
const crypto = require("node:crypto")
const Chat = require("../models/chat") 

const initialiseSocket = (server) => {

    const getSecretRoomId = (userId,targetUserId) => {
        return crypto
        .createHash("sha256")
        .update([userId,targetUserId].sort().join("_"))
        .digest("hex")
    }

    const io = socket(server,{
        cors : {
           origin : "http://localhost:5173"
        }
    })
    
    io.on("connection", (socket) => {
        socket.on("joinChat",({firstName,userId,targetUserId}) => {
            const roomId = getSecretRoomId(userId,targetUserId)
            console.log(firstName + " joined the room " + roomId);
            
            socket.join(roomId)
        })
        socket.on("sendMessage",async({firstName,userId,targetUserId,text,photo}) => {
            // add the message to the common room
            const roomId = getSecretRoomId(userId,targetUserId)
            // save messages to the db
            try {
            let chat = await Chat.findOne({
                participants : {
                    $all: [
                        userId,targetUserId
                    ]
                }


            })
            
            if(!chat){
                chat = new Chat({
                    participants : [userId,targetUserId],
                    messages : []
                })
            }

            chat.messages.push({
                senderId : userId,
                text 
            })
            
            await chat.save()

            const newMessage = chat.messages[chat.messages.length - 1]

            io.to(roomId).emit("messageReceived",{firstName,text,userId,photo,createdAt:newMessage.createdAt})
            }catch(err){
                console.log(err.message);
            }
        })
        socket.on("disconnect",() => {})
    })
}

module.exports = initialiseSocket