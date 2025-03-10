const jwt = require('jsonwebtoken')

const generateToken = async (payload, expiry) => {
    return jwt.sign({payload}, process.env.JWT_TOKEN_SECRET, {expiresIn: expiry})
}

const verifyToken = async (payload) => {
    return jwt.verify(payload, process.env.JWT_TOKEN_SECRET)
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