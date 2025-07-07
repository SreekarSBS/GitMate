const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ['accepted', 'rejected' , 'ignored' , 'interested'],
            message : "Invalid status value"
        }
    }
},
{
    timestamps : true
}
)
connectionRequestSchema.index({fromUserid: 1 , toUserId : 1})
connectionRequestSchema.pre('save', function(){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send a connection request to yourself");
    }
})
const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports = ConnectionRequest