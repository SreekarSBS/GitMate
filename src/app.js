
const express = require("express")
const cors = require("cors")
const app = express()
const ConnectDB = require("./config/database")

const { userRouter } = require('./routes/user')
const { authRouter}  = require('./routes/auth')
const { feedRouter}  = require('./routes/feed')
const { profileRouter}  = require('./routes/profile')
const {requestRouter} = require('./routes/request')
const cookieParser = require("cookie-parser")


// We want to fetch the data from the api (POST) through Postman , we need to parse it to JS Object
app.use(cors({
    origin : "http://localhost:5173/",
    credentials : true,
  
})) 


app.use(express.json())
app.use(cookieParser())


app.use("/",userRouter)
app.use("/",authRouter)
app.use("/",feedRouter) 
app.use("/",profileRouter)
app.use("/",requestRouter)

ConnectDB().then(() => {
    console.log("Connection estabilished");
    app.listen(3000,() => {
    console.log("Listening from Server port 3000");
})
   }).catch(err => {
   console.log("Database Connection failed ");
   
   })



