const userModel = require("../db/models/user-model")
const { AsyncHandler, ApiError, ApiResponse } = require("../utils/ApiHelpers")
const { verifyToken, tokenExpiries } = require("../utils/generateTokens")
const sendOtp = require("../utils/otpHelpers")
const StatusCodes = require("../utils/statusCodes")

/*
  Expected request body:
    {
        otp: string,            // The OTP entered by the user
        email: string,          // The user's email address             email and type are temporarily stored in cookies as tempVal (temp validation)
        type: string            // "verifyEmail" or "resetPassword"
    }
  Flow:
    1. Check required fields (otp, type, email).
    2. Find the user by email.
    3. Depending on the OTP type:
       a. For "verifyEmail": compare with user.veriftEmailOtp and ensure it hasn't expired.
          - If valid, update user.isVerified and clear OTP fields.
       b. For "resetPassword": compare with user.forgotPasswordOtp and ensure it hasn't expired.
          - If valid, allow a password reset by setting allowResetPassword to true with a short expiry.
    4. Return a success response if OTP verification passes.

  In case of any failure, an ApiError is thrown.
*/
const verifyOtp = AsyncHandler(async (req, res) => {
    const { otp } = req.body
    const { tempVal } = req.cookies
    
    if (!tempVal || !otp || otp.length !== 6 || typeof otp !== "string") {
        throw new ApiError("otp has expired", StatusCodes.BAD_REQUEST)
    }
    const { payload } = await verifyToken(tempVal)
    const { email, type } = payload

    const user = await userModel.findOne({ email })
    if (!user) {
        throw new ApiError("Invalid request", StatusCodes.NOT_FOUND)
    }

    if (user.isVerified && type === "verifyEmail") {
        throw new ApiError("This email is already verified", StatusCodes.CONFLICT)
    }

    try {
        if (type === "resetPassword") {
            await user.setAllowResetPasswordTime(otp)
        } else if (type === "verifyEmail") {
            await user.setVerifiedAccount(otp)
        } else {
            throw new ApiError("Invalid request", StatusCodes.BAD_REQUEST)
        }
        await user.save()

        const { statusCode, ...response } = new ApiResponse(`${type === "verifyEmail" ? "your email is verified" : "password reset otp is verified, proceed to reset password"}`, StatusCodes.OK)
        res
            .status(statusCode)
            .clearCookie("tempVal")
            .json(response)

    } catch (error) {
        user.forgotPasswordOtp = null
        user.forgotPasswordOtpExpiry = null
        user.veriftEmailOtp = null
        user.veriftEmailOtpExpiry = null
        user.save()
        res.status(500).json(error.message)
    }
})

/**
 * Expected request body:
 * {
 *   email: string, // The user's email address
 *   type: string   // Should be either "resetPassword" or "verifyEmail"
 * }
 *
 * Flow:
 * 1. Validate that the email is provided.
 * 2. Validate that the type is either "resetPassword" or "verifyEmail".
 * 3. Find the user associated with the provided email.
 *    - If the user is not found, throw an error.
 *    - If the type is "verifyEmail" and the user is already verified, throw an error.
 * 4. Call the sendOtp function to send a new OTP to the user's email.
 * 5. Generate a temporary token (tempVal) valid for 3 minutes, which holds the email and type.
 * 6. Set the tempVal in a cookie with appropriate settings.
 * 7. Return a success response indicating that the OTP has been sent.
 */
const resendOtp = AsyncHandler(async (req, res) => {
    const { email, type } = req.body

    if (!email) {
        throw new ApiError("Email is required", StatusCodes.BAD_REQUEST)
    }
    if (type == "resetPassword" || type == "verifyEmail") {

        const user = await userModel.findOne({ email })
        if (!user) {
            throw new ApiError("Invalid request", StatusCodes.NOT_FOUND)
        }
        if (type === "verifyEmail" && user.isVerified) {
            throw new ApiError("This email is already verified", StatusCodes.CONFLICT)
        }

        await sendOtp(email, type)

    } else {
        throw new ApiError("Invalid request", StatusCodes.BAD_REQUEST)
    }

    const tempVal = await generateToken({ email, type }, tokenExpiries.tempValExp)

    const { statusCode, ...response } = new ApiResponse("Otp has sent to your email", StatusCodes.OK)
    res
        .status(statusCode)
        .cookie("tempVal", tempVal, otpValidationMailCookie)
        .json(response)
})

module.exports = {
    verifyOtp,
    resendOtp
}