module.exports.authMiddleware = async ( req, res, next ) => {
    const token= await req.cookies
    console.log("authmiddleware says: ",token);
    console.log("Cookies in headers:", req.headers.cookie);
    next()
}