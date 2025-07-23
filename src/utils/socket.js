const socket = require("socket.io")
const crypto = require("node:crypto")
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
        socket.on("sendMessage",({firstName,userId,targetUserId,text,photo}) => {
            // add the message to the common room
            const roomId = getSecretRoomId(userId,targetUserId)
            console.log(firstName +": " + text);
            
            io.to(roomId).emit("messageReceived",{firstName,text,userId,photo})
        })
        socket.on("disconnect",() => {})
    })
}

module.exports = initialiseSocket