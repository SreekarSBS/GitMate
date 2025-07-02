const mongoose = require("mongoose")
const validator = require("validator")

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
        match : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
       validate(value){
        if(!validator.isEmail(value)) throw new Error("Invalid email format")
        }
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
       validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL format")
            }
        }
    }
},
{
    timestamps : true
}
)

const User = mongoose.model("User",userSchema)

module.exports = User