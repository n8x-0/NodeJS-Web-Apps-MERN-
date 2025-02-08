const jwt = require("jsonwebtoken")
module.exports.getSession = async ( req, res) => {
    const token = req.cookies.session_token
    const session = jwt.verify(token, process.env.JWT_SECRET)

    console.log("session controller: ", session);
    
    if(session){
        return res.status(200).json(session)
    }else{
        return res.status(400).json({error: "no session found"})
    }
}