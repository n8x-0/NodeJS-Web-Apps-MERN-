const jwt = require("jsonwebtoken")

const sessionUpdate = (updatedUserData, res) => {
    const { _id, username, email, image } = updatedUserData

    try {
        const token = jwt.sign({ _id, username, email, image }, process.env.JWT_SECRET)
        const isProduction = process.env.NODE_ENV === "production"
        res.cookie("session_token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "lax",
            domain: isProduction ? "n8xgram.vercel.app" : undefined,
            path: "/",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "User session failed." })
    }
}

module.exports = sessionUpdate

