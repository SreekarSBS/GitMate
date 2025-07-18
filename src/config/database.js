const mongoose = require("mongoose")
require("dotenv").config()

const ConnectDB = async() => {
    await mongoose.connect(process.env.MONGO_URI);
}

module.exports = ConnectDB
