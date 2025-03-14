require("dotenv").config()
const express = require("express")
const cookieParser = require('cookie-parser')
const app = express()
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const videoRoutes = require("./routes/videos.routes")
const { getSession } = require("./controllers/session.controller")
const { authMiddleware, isLoggedIn } = require("./middlewares/authmiddleware")

app.use(cookieParser())
app.use(express.json({limit: "100mb"}))
app.use(express.urlencoded({ limit: "100mb", extended: true }))

app.use(cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: ["https://n8xgram.vercel.app", "http://localhost:3000"],
    credentials: true,
}))

app.use("/auth", authRoutes)
app.use("/user/:userid", isLoggedIn, userRoutes)
app.use("/videos", videoRoutes)
app.get("/session/getsession", getSession)

module.exports = app