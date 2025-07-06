const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
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
        // match : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
       validate(value){
        if(!validator.isEmail(value)) throw new Error("Invalid email format")
        }
    },
    password : {
        type : String ,
        required : true,
        // match : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        
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

userSchema.methods.getJWT = function(){
    const userDocument = this;
    const jwtt =  jwt.sign({_id : userDocument._id},"DEV@Tinder$790")
    return jwtt
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const userDocument = this;
    

    const isPasswordValid = await bcrypt.compare(passwordInputByUser,userDocument.password )

    console.log(`Password validation result: ${isPasswordValid}`);
    
    return isPasswordValid;
}

// userSchema.pre("save", async function (next) {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

userSchema.index({firstName : 1 , lastName : 1})

const User = mongoose.model("User",userSchema)

module.exports = User