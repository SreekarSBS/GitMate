const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async(req,res,next) => {
    try{
   const {token} = req.cookies
   // Token from the user , are u there
   if(!token) throw new Error("Please Login to continue")

    // if not, fetch the id to check the database
    const decodedObj = jwt.verify(token, "DEV@Tinder$790",{expiresIn: '1d'});

    const {_id} = decodedObj;

    const userDocument = await User.findById(_id); 
    console.log("User document is here " + userDocument) ;
    
    if(!userDocument)  throw new Error("User not found");
     
    req.user = userDocument;
    console.log("User authenticated successfully");
    next()
}catch(err) {
    res.status(401).send("Authentication failed: "+ err.message);
    }
}


module.exports = {
    userAuth,
}