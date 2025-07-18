const cron = require("node-cron")
const {subDays, startOfDay, endOfDay} = require("date-fns")
const ConnectionRequest = require("../models/connectionRequest")
const {run} = require("../utils/ses_sendEmail")
cron.schedule( "5 22 * * *" , async() => {
   
    // Send emails to all people who got requests the previous day
    try{
        const yesterday = subDays(new Date(),0)
        // timestamps 
        const yesterdayStart = startOfDay(yesterday)
        const yesterdayEnd = endOfDay(yesterday)

        const pendingRequestsfromYesterday = await ConnectionRequest.find({
            status : "interested",
            createdAt : {
                $gte : yesterdayStart,
                $lt : yesterdayEnd
            }
        }).populate("fromUserId toUserId")

        const listOfEmails = [...new Set(pendingRequestsfromYesterday.map(req => req.toUserId?.emailId))]
        console.log(listOfEmails);
        
        for(const email of listOfEmails){
            try {
               console.log(email);
               
                const sub = "Friend Requests Pending for User "
                const body = `${email} , Please make some time to review your incoming requests.`
           const res = await run(sub,body)   
            console.log(res);
                
        }catch(err){
                console.log(err.message);
                
            }
        }
    }
    catch(err){
        console.log(err);
        
    }
})