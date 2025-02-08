const mongoose = require("mongoose")

module.exports.dbconnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("connected to databsae");
    } catch (error) {
        console.log("Failed connecting to db: ", error);
    }
}

module.exports.disconnectDB = async () => await mongoose.disconnect()