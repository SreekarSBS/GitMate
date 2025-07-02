
const express = require("express")

const app = express()
const ConnectDB = require("./config/database")
const User = require("./models/user")

// We want to fetch the data from the api (POST) through Postman , we need to parse it to JS Object
app.use(express.json())




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

app.get("/feed", async(req,res) => {
    try{
    const allUserDocuments = await User.findByIdAndUpdate({})
    res.send(allUserDocuments)
    } catch(err){
        res.status(400).send("Something went wrong")
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

// app.patch("/user", async(req,res) => {
//     try{
//         const userDocument = req.body;
//         if(!userDocument.userId) return res.status(400).send("User ID is required")
//         const updatedData = await User.findByIdAndUpdate(userDocument.userId,userDocument);
//         res.send("User updated successfully ",updatedData)
//     }   catch(err) {   
//         res.status(400).send("Update operation failed")
//     }
// })

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
    const updatedData = await User.findOneAndUpdate({emailId :emailId},req.body,{ returnDocument: 'after' })
    console.log(updatedData);
    
    res.send("User updated successfully ", updatedData)
    } catch(err) {
        res.status(400).send("Update operation failed " + err.message)
    }
})

app.post("/signup" , async(req , res) => {
    // Creating an instance of a model .
     const users = new User(req.body)
    
try {
await users.save()
res.send("User added successfully !")
} catch(err){
    res.status(400).send("Something Went wrong " + err.message)
}
})



ConnectDB().then(() => {
    console.log("Connection estabilished");
    app.listen(3000,() => {
    console.log("Listening from Server port 3000");
})
   }).catch(err => {
   console.log("Database Connection failed ");
   
   })



