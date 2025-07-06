const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
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

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports = ConnectionRequest