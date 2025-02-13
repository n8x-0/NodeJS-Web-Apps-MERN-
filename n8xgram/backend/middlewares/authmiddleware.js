const jwt = require("jsonwebtoken")

module.exports.authMiddleware = async ( req, res, next ) => {
    const {userid} = req.params
    
    const token = req.cookies.session_token
    if(!token){
        return res.status(401).json({error: "No session found"})
    }
    const session = jwt.verify(token, process.env.JWT_SECRET)
    if(!session){
        return res.status(401).json({error: "Invalid session"})
    }
    if(session._id !== userid){
        return res.status(401).json({error: "Invalid session"})
    }
    next()
}