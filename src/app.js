
const express = require("express")
const cors = require("cors")
const app = express()
const ConnectDB = require("./config/database")
require("dotenv").config()
require("./utils/cronjob")

const { userRouter } = require('./routes/user')
const { authRouter}  = require('./routes/auth')
const { feedRouter}  = require('./routes/feed')
const { profileRouter}  = require('./routes/profile')
const {requestRouter} = require('./routes/request')
const { chatRouter}  = require('./routes/chat')

const cookieParser = require("cookie-parser")

const http = require("http")
const initialiseSocket = require("./utils/socket")
const server = http.createServer(app)

initialiseSocket(server)

const allowedOrigins = [
    "http://localhost:5173",
    "http://54.79.4.212" // 👈 Add this!
  ];

// We want to fetch the data from the api (POST) through Postman , we need to parse it to JS Object
app.use(cors({
    origin : allowedOrigins,
    credentials : true,
  
})) 

 app.set("trust proxy", 1); // if you're behind nginx or a cloud load balancer

app.use(express.json())
app.use(cookieParser())


app.use("/",userRouter)
app.use("/",authRouter)
app.use("/",feedRouter) 
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",chatRouter)

ConnectDB().then(() => {
    console.log("Connection estabilished");
    server.listen(process.env.PORT,() => {
    console.log("Listening from Server port " + process.env.PORT);
})
   }).catch(err => {
   console.log("Database Connection failed ");
   
   })



