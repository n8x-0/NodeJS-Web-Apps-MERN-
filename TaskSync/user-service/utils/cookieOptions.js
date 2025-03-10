const isProduction = process.env.NODE_ENV === "production"

const options = {
    httpOnly: isProduction,
    secure: isProduction,
    sameSite: isProduction ? "None" : "lax"
}

const accessTokenOptions = {
    ...options,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
};

const refreshTokenOptions = {
    ...options,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
};

const otpValidationMailCookie = {
    ...options,
    expires: new Date(Date.now() +  5 * 60 * 1000) // 5 min
}

module.exports = {
    accessTokenOptions,
    refreshTokenOptions,
    otpValidationMailCookie
};