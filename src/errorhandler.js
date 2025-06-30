const express = require("express")

const app = express()

app.put("/user106",
    [(req,res,next) => {
     console.log("Route handler 1");
     next()
      res.send("DevMeet is a Platform for developers to meet and connect with fellow developers online.")
    
    
},[(req,res,next) => {
    console.log("Im not sending any request , im just logging this");
   next()
}],(req,res,next) => {
   console.log("Im just a human after all");
    
}])

    app.use("/user106",(err,req,res,next) => {
      if(err);
        res.status(401).send("Something went wrong")
        
    })

app.listen(9999,() =>{
    console.log("Listening on port 9999");
})