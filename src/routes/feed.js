const express = require("express")
const feedRouter = express.Router()
const User = require("../models/user")


feedRouter.get("/feed", async(req,res) => {
    try{
    const allUserDocuments = await User.find({})
    res.send(allUserDocuments)
    } catch(err){
        res.status(400).send("Something went wrong")
    }
})

module.exports = {
    feedRouter
}