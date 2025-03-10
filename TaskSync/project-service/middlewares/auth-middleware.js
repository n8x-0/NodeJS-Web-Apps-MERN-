const { AsyncHandler, ApiError } = require("../utils/ApiHelpers")
const { verifyToken } = require("../utils/generateTokens")
const StatusCodes = require("../utils/statusCodes")

const isLoggedIn = AsyncHandler(async (req, res, next) => {
    const { accessToken } = req.cookies
    if (!accessToken) {
        throw new ApiError("Unauthorized, refresh the token", StatusCodes.UNAUTHORIZED)
    }
    try {
        const {payload} = await verifyToken(accessToken)
        req.payload = payload
        next()
    } catch (error) {
        throw new ApiError('Something went wrong', 500)
    }
})

module.exports = {
    isLoggedIn,
}