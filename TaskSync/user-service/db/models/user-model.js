const mongoose = require('mongoose');
const { encryptPassword } = require('../../utils/passwordHashHelper');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        ruired: [true, 'Username is required.'],
        maxLength: [50, 'Username cannot exceed 50 characters.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        trim: true
    },
    avatar: {
        type: String,
        default: "",
        trim: true
    },
    bio: {
        type: String,
        maxLength: 200,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    veriftEmailOtp: {
        type: String,
        default: null
    },
    veriftEmailOtpExpiry: {
        type: Date,
        default: null
    },
    forgotPasswordOtp: {
        type: String,
        default: null
    },
    forgotPasswordOtpExpiry: {
        type: Date,
        default: null
    },
    allowResetPassword: {
        type: Boolean,
        default: false
    },
    allowResetPasswordExpiry: {
        type: Date,
        default: null
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }],
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
})

// methods

userSchema.methods.generateEmailVerificationOtp = function () {
    this.veriftEmailOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
    this.veriftEmailOtpExpiry = new Date(Date.now() + 3 * 60 * 1000); // Expires in 3 minutes
    return this.veriftEmailOtp;
}

userSchema.methods.generateForgotPasswordOtpOtp = function () {
    this.forgotPasswordOtp = Math.floor(100000 + Math.random() * 900000).toString();
    this.forgotPasswordOtpExpiry = new Date(Date.now() + 3 * 60 * 1000); // Expires in 3 minutes
    return this.forgotPasswordOtp;
}

userSchema.methods.setAllowResetPasswordTime = function (otp) {
    if (this.forgotPasswordOtp === otp && this.forgotPasswordOtpExpiry > new Date()) {
        this.allowResetPasswordExpiry = new Date(Date.now() + 5 * 60 * 1000)
        this.forgotPasswordOtp = null
        this.forgotPasswordOtpExpiry = null
    } else {
        throw new Error("invalid or expired otp")
    }
}

userSchema.methods.setVerifiedAccount = function (otp) {
    if (this.veriftEmailOtp === otp && this.veriftEmailOtpExpiry > new Date()) {
        this.isVerified = true
        this.veriftEmailOtp = null
        this.veriftEmailOtpExpiry = null
    } else {
        throw new Error("invalid or expired otp")
    }
}

// middlewares

userSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = encryptPassword(this.password);
    }
    next();
});

module.exports = mongoose.model("User", userSchema)