const { AsyncHandler, ApiError, ApiResponse } = require("../utils/ApiHelpers")
const { refreshTokenOptions, accessTokenOptions } = require("../utils/cookieOptions")
const { verifyToken, generateToken, tokenExpiries } = require("../utils/generateTokens")
const StatusCodes = require("../utils/statusCodes")

const refreshToken = AsyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
        throw new ApiError("Your session has expired, pleas login to continue", StatusCodes.UNAUTHORIZED)
    }

    try {
        const { payload } = await verifyToken(refreshToken)
        
        const [accessToken, newRefreshToken] = await Promise.all([
            generateToken(payload, tokenExpiries.accessTokenExp),
            generateToken(payload, tokenExpiries.refreshTokenExp)
        ])

        const { statusCode, ...response } = new ApiResponse("Session has been refreshed, enjoy :)", StatusCodes.OK)

        res
            .status(statusCode)
            .cookie("accessToken", accessToken, accessTokenOptions)
            .cookie("refreshToken", newRefreshToken, refreshTokenOptions)
            .json(response)
    } catch (error) {
        throw new ApiError("Invalid session, pleas login again to continue", StatusCodes.UNAUTHORIZED)
    }
})

module.exports = { refreshToken }