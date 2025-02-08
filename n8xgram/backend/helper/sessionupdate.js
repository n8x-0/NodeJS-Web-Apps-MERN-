const jwt = require("jsonwebtoken")

const sessionUpdate = (updatedUserData, res) => {
    const { _id, username, email, image } = updatedUserData
    try {
        const token = jwt.sign({ _id, username, email, image }, process.env.JWT_SECRET)
        res.cookie("session_token", token)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "User session failed." })
    }
}

module.exports = sessionUpdate