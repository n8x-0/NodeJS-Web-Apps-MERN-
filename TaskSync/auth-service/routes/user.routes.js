const express = require('express')
const router = express.Router()
const { register, login, logout } = require('../controllers/auth.controllers');
const { refreshToken } = require('../controllers/refreshtoken.controllers');
const { forgetPassword, resetPassword } = require('../controllers/password.controllers');
const { deleteAccount } = require('../controllers/deleteaccount.controllers');
const { verifyOtp, resendOtp } = require('../controllers/otp.controllers');

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/refresh-token", refreshToken)
router.post("/verify-otp", verifyOtp)
router.post("/resend-otp", resendOtp)
router.post("/forget-password", forgetPassword)
router.post("/reset-password", resetPassword)
router.get("/delete-account", deleteAccount)


module.exports = router