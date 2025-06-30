const mongoose = require("mongoose")

const ConnectDB = async() => {
    await mongoose.connect("mongodb+srv://sbssreekar:lY46eL3U2pOKIly7@namastenode.18ycpnh.mongodb.net/DevMeet");
}

module.exports = ConnectDB