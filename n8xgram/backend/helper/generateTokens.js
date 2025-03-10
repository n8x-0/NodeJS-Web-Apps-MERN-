const jwt = require('jsonwebtoken')

const generateToken = async (payload, expiry = "0") => {
    return jwt.sign({payload}, process.env.JWT_SECRET)
}

const verifyToken = async (payload) => {
    return jwt.verify(payload, process.env.JWT_SECRET)
}

const tokenExpiries = {
    accessTokenExp: "1d",
    refreshTokenExp: "7d",
    tempValExp: "5m"
}

module.exports = {
    generateToken,
    verifyToken,
    tokenExpiries
}