const { AsyncHandler, ApiError, ApiResponse } = require("../utils/ApiHelpers");
const StatusCodes = require("../utils/statusCodes");
const { verifyToken } = require("../utils/generateTokens");
const userModel = require("../db/models/user-model");

const deleteAccount = AsyncHandler(async (req, res) => {
    const { accessToken } = req.cookies
    if (!accessToken) {
        throw new ApiError("Unauthorized request", StatusCodes.UNAUTHORIZED)
    }
    
    try {
        const { payload } = await verifyToken(accessToken)
        await userModel.findByIdAndDelete(payload)    
    } catch (error) {
        throw new ApiError("Something went wrong", StatusCodes.UNAUTHORIZED)
    }
    
    const {statusCode, ...response} = new ApiResponse("Your accound has been deleted", 200)
    return res
    .status(statusCode)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(response)
})

module.exports = { deleteAccount }