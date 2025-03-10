const userModel = require("../db/models/user-model")
const nodemailer = require("nodemailer")

const sendEmail = async (data) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    })

    const mailOptions = {
        from: '"TaskSync" <syedshayan1324@gmail.com>', // sender address
        to: data.emailTo, // list of receivers
        subject: data.emailType === 'verifyEmail' ? 'Verify your account' : 'Reset your password', // Subject line
        html: `<p>Hi ${data.username},</p><b/><p>Use the verifcation code below to ${data.emailType === 'verify' ? 'verify your account' : 'reset your password'}.</p>
        <h2>${data.otp}</h2>
        <b/>
        <p>This code expires in 3 minutes</P>`, // html body
    }

    await transporter.sendMail(mailOptions)
}

const sendOtp = async (email, type) => {
    const isUser = await userModel.findOne({ email })
    if (!isUser) {
        throw new Error("Email not found as registered")
    }

    let otp;
    if (type === "verifyEmail") {
        otp = isUser.generateEmailVerificationOtp()
    } else if (type === "resetPassword") {
        otp = isUser.generateForgotPasswordOtpOtp()
    } else {
        throw new Error("Invalid action performed")
    }
    isUser.save()
    console.log(`OTP for ${type == "verifyEmail" ? "email verificaton of" : "reset password of"}${email}: ${otp}`);

    const emailInfo = {
        emailTo: email,
        username: isUser.username,
        emailType: type,
        otp: isUser.veriftEmailOtp
    }

    try {
        await sendEmail(emailInfo)
    } catch (error) {
        isUser.veriftEmailOtp = null;
        isUser.veriftEmailOtpExpiry = null;
        throw new Error(error.message)
    }
}

module.exports = sendOtp