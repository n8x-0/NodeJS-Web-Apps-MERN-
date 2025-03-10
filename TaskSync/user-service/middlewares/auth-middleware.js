const userModel = require("../db/models/user-model")
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

const isVerifiedUser = AsyncHandler(async (req, res, next) => {
    const { accessToken } = req.cookies
    if (!accessToken) {
        throw new ApiError("Unauthorized, refresh the token", StatusCodes.UNAUTHORIZED)
    }
    try {
        const { payload } = await verifyToken(accessToken)
        const user = await userModel.findById(payload).select("-password")
        if (!user) {
            throw new ApiError('Unauthorized', StatusCodes.BAD_REQUEST)
        }
        if (!user.isVerified) {
            throw new ApiError('To continue, please verify your email first', StatusCodes.BAD_REQUEST)
        }
        next()
    } catch (error) {
        throw new ApiError('Something went wrong', 500)
    }
})

const currUser = AsyncHandler(async (req, res,next) => {
    const { payload } = req
    try {
        const user = await userModel.findById(payload).select("-password")
        if (!user) {
            throw new ApiError('Unauthorized', StatusCodes.BAD_REQUEST)
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError('Something went wrong', 500)
    }
})

module.exports = {
    isLoggedIn,
    isVerifiedUser,
    currUser
}