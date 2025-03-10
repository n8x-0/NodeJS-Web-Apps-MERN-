const express = require("express")
const router = express.Router()
const { register, login, logout, getSession } = require("../controllers/auth.controllers")
const { currUser, isLoggedIn } = require("../middlewares/authmiddleware")

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/session", isLoggedIn, currUser, getSession)


module.exports = router