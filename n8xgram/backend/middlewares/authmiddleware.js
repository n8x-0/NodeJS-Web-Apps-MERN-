const jwt = require("jsonwebtoken")

module.exports.authMiddleware = async ( req, res, next ) => {
    const {userid} = req.params
    const token = req.cookies.session_token

    console.log("\n\nmiddleware says \n=====================================\n", userid, "\n=====================================\n", token ? "token available" : "no token" , "\n=====================================\n");
    
    if(!token){
        return res.status(401).json({error: "No session found"})
    }
    const session = jwt.verify(token, process.env.JWT_SECRET)
    if(!session){
        console.log("no session found or session verification failed");
        return res.status(401).json({error: "Invalid session"})
    }
    if(session._id !== userid){
        console.log("session id isnt equal to userid");
        return res.status(401).json({error: "Invalid session"})
    }
    next()
}