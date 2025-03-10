const userModel = require("../db/models/user-model")
const { AsyncHandler, ApiError, ApiResponse } = require("../utils/ApiHelpers")
const { otpValidationMailCookie } = require("../utils/cookieOptions")
const { generateToken, tokenExpiries } = require("../utils/generateTokens")
const sendOtp = require("../utils/otpHelpers")
const StatusCodes = require("../utils/statusCodes")

/* 
    body : { email }
    check if there is email and user with that email
    sendOtp to the email, (sendOtp includes more data handling)
    generate tempVal token for 3 minutes with the type for the otp verification page that will only ask for otp and not email (incase user isnt logged in)
    type is required for sendOtp function to send set otp in db dynamically for reset pass and email verification 
    send the response and set tempVal cookie
*/
const forgetPassword = AsyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        throw new ApiError("Email is required", StatusCodes.BAD_REQUEST)
    }
    const isUser = await userModel.findOne({ email })
    if (!isUser) {
        throw new ApiError("Invalid credentials", StatusCodes.NOT_FOUND)
    }

    try {
        await sendOtp(email, "resetPassword")
    } catch (error) {
        throw new ApiError("Sending otp to the email has failed, pleas try again", StatusCodes.INTERNAL_SERVER_ERROR)
    }

    const tempVal = await generateToken({ email, type: "resetPassword" }, tokenExpiries.tempValExp)
    const { statusCode, ...response } = new ApiResponse("otp has been sent to your email", StatusCodes.OK)
    res
        .status(statusCode)
        .cookie("tempVal", tempVal, otpValidationMailCookie)
        .json(response)
})
/* 
    body : {newPassword , email }
    check if there is email and newPassword (validate passw and confirm passw on frontenf)
    check if there is user with that email
    check if user is allowed to reset password as it includes reset password otp verification in the flow which set 5 minutes timer in db to reset password after that user can't reset password
    save new password, (password is auto hash due to mongoose middleware in userSchema)
    send the response and remove tempVal cookie that has been used during otp verification
*/
const resetPassword = AsyncHandler(async (req, res) => {
    const { newPassword, email } = req.body
    
    if (!email || !newPassword) {
        throw new ApiError("Email and new password is required", StatusCodes.BAD_REQUEST)
    }
    const isUser = await userModel.findOne({ email })
    if (!isUser) {
        throw new ApiError("Invalid credentials", StatusCodes.NOT_FOUND)
    }
    
    if(isUser.allowResetPasswordExpiry < new Date()){
        throw new ApiError("Reset password verification time out, please reset within 5 minutes after reset password verification", StatusCodes.NOT_FOUND)
    }

    isUser.password = newPassword
    isUser.save()

    const {statusCode , ...response} = new ApiResponse("Your password is updated", StatusCodes.OK)
    res
    .status(statusCode)
    .clearCookie("tempVal")
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(response)
})


module.exports = {
    forgetPassword,
    resetPassword,
}
