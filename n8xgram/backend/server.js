require("dotenv").config()
const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const bodyParser = require("body-parser")
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const videoRoutes = require("./routes/videos.routes")
const { getSession } = require("./controllers/session.controller")
const { authMiddleware } = require("./middlewares/authmiddleware")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "http://localhost:3000",
    credentials: true,
}))

app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.use("/videos", videoRoutes)
app.get("/session/getsession", getSession)

app.listen("3001", () => {
    console.log("server is running on \nhttp://localhost:3001");
})