const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 4
    },
    lastName : String,
    emailId : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        match : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password : {
        type : String ,
        required : true,
        match : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        maxLength : 24
    },
    gender : {
        type : String , 
        enum : ["other","male","female","m","f"],
        lowercase : true,
    },
    photoURL :{
        type : String ,
        default : "https://media.istockphoto.com/id/2212478710/vector/faceless-male-avatar-in-hoodie-illustration.jpg?s=612x612&w=0&k=20&c=Wlwpp5BUnzbzXxaCT0a7WqP_JvknA-JtOhBoKDpQMHE="
    }
},
{
    timestamps : true
}
)

const User = mongoose.model("User",userSchema)

module.exports = User