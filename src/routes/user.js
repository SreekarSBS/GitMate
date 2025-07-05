const express = require('express')
const userRouter = express.Router()
const User = require("../models/user")
const cookies=  require("cookies")

app.get("/user", async (req,res) => {
    const userEmailId = req.body.emailId
try{
    const userDocument = await User.find({emailId : userEmailId})
    if(userDocument.length === 0 ) return res.status(404).send("User not found")
    res.send(userDocument)
}catch(err){
    res.status(400).send("Something went wrong")
}
})

app.patch("/user/:emailId", async(req,res) => {
    try {
     const userDocument = req.body;
     const emailId = req.params?.emailId
     const ALLOWED_UPDATES = [
         "firstName",
         "lastName",
         "age",
         'photoURL',
         'password'
     ]
     if(!Object.keys(userDocument).every(k => ALLOWED_UPDATES.includes(k))) throw new Error("Invalid update fields")
 
 
     if(!emailId) return res.status(404).send("User not found")
     const updatedData = await User.findOneAndUpdate({emailId :emailId},req.body,{ returnDocument: 'after'  , runValidators: true});
     console.log(updatedData);
     
     res.send("User updated successfully ", updatedData)
     } catch(err) {
         res.status(400).send("Update operation failed " + err.message)
     }
 })

app.patch("/user", async(req,res) => {
    try{
        const userDocument = req.body;
        if(!userDocument.userId) return res.status(400).send("User ID is required")
        const updatedData = await User.findByIdAndUpdate(userDocument.userId,userDocument);
        res.send("User updated successfully ",updatedData)
    }   catch(err) {   
        res.status(400).send("Update operation failed")
    }
})



app.delete("/user", async(req,res) => {
    try{
    const userId = req.body.userId;
    if(!userId) return res.status(400).send("User ID is required")
    await User.findByIdAndDelete(userId);
res.send("User deleted successfully")
    } catch(err) {
        res.status(400).send("Delete operation failed")
    }
})

module.exports = {
    userRouter 
}