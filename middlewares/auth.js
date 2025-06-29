const adminAuth = (req,res,next) => {
    const token = "xyz"
    if( token === "xyz") {
        next();
    }
    else {
        res.status(401).json("Invalid : Users dont have access to admin.")
    }
}

const userAuth = (req,res,next) => {
    const token = "yz"
    if( token === "xyz") {
        next();
    }
    else {
        res.status(401).json("Invalid : Users dont have access to user data.")
    }
}


module.exports = {
    adminAuth,userAuth,
}