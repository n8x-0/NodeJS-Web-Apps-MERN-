const { verifyToken } = require("../helper/generateTokens")
const dbUsermodel = require("../db/db.usermodel")
const { dbconnect } = require("../db/db.connection")

const isLoggedIn = async (req, res, next) => {
    const { session_token } = req.cookies
    
    if (!session_token) {
        return res.status(401).json("unauthorized")
    }
    try {
        const {payload} = await verifyToken(session_token)
        req.payload = payload
        
        next()
    } catch (error) {
        console.log(error);
        res.status(500).json("Session has expired")
    }
}

const currUser = async (req, res,next) => {
    const { payload } = req
    
    try {
        await dbconnect()
        const user = await dbUsermodel.findById(payload).select("-password")
        if (!user) {
            return res.status(404).json("Unknown user, not found")
        }
        
        req.user = user
        next()
    } catch (error) {
        res.status(500).json("Session went wrong")
    }
}

module.exports = {
    isLoggedIn,
    currUser
}