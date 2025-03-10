const userModel = require("../db/models/user-model");
const { ApiError, AsyncHandler, ApiResponse } = require("../utils/ApiHelpers");
const { accessTokenOption, refreshTokenOptions, otpValidationMailCookie } = require("../utils/cookieOptions")
const { generateToken, tokenExpiries } = require("../utils/generateTokens");
const sendOtp = require("../utils/otpHelpers");
const { decryptPassword } = require("../utils/passwordHashHelper");
const StatusCodes = require("../utils/statusCodes");
const { validateEmail, validatePassword, validateUsername } = require("../utils/validators");

const register = AsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError("All fields are required", StatusCodes.BAD_REQUEST)
    }

    try {
        validateUsername(username)
        validateEmail(email)
        validatePassword(password)

        if (existingUser) {
            throw new ApiError("Email is already in use", StatusCodes.CONFLICT)
        }

        const newUser = userModel.create(data)
        delete newUser._doc.password

        try {
            await sendOtp(email, "verifyEmail")
        } catch (error) {
            throw new ApiError("Sending otp to the email has failed, pleas try again", StatusCodes.INTERNAL_SERVER_ERROR)
        }

        const tempVal = generateToken({ email, type: "verifyEmail" }, tokenExpiries.tempValExp)

        const { statusCode, ...response } = new ApiResponse("User registered successfully, please verify your email", StatusCodes.OK, newUser)
        res
            .status(statusCode)
            .cookie("tempVal", tempVal, otpValidationMailCookie)
            .json("response")
    } catch (error) {
        throw new ApiError(error.message, StatusCodes.BAD_REQUEST)
    }
})

const login = AsyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError("All fields are required", StatusCodes.UNAUTHORIZED)
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        throw new ApiError("Invalid credentials", StatusCodes.UNAUTHORIZED)
    }

    const isValidPassword = decryptPassword(password, user.password)
    if (!isValidPassword) {
        throw new ApiError("Invalid credentials", StatusCodes.BAD_REQUEST)
    }

    delete user._doc.password

    const [accessToken, refreshToken] = await Promise.all([
        generateToken(user.id, tokenExpiries.accessTokenExp),
        generateToken(user.id, tokenExpiries.refreshTokenExp)
    ])

    const { statusCode, ...response } = new ApiResponse("User logged in succesfully, pleas verify your account", StatusCodes.OK, user)

    res
        .status(statusCode)
        .cookie("accessToken", accessToken, accessTokenOption)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(response)
})

const logout = (req, res) => {
    res
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    register,
    login,
    logout
}