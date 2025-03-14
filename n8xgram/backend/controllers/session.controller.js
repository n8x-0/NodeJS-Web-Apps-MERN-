const jwt = require("jsonwebtoken")
module.exports.getSession = async ( req, res) => {
    console.log("session called")
    const token = req.cookies.session_token;
    if(token){
        console.log("token is available");
    }else{
        console.log("no session token found");
    }
    
    if(!token){
        return res.status(400).json({error: "no session found"});
    }
    const session = jwt.verify(token, process.env.JWT_SECRET)
    if(session){
        return res.status(200).json(session)
    }else{
        return res.status(400).json({error: "no session found"});
    }
}