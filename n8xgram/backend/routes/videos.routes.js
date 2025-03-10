const express = require("express")
const router = express.Router()
const {getAllvideos, uploadVideo, getSigned } = require("../controllers/posts.controllers")
const { currUser, isLoggedIn } = require("../middlewares/authmiddleware")

router.post("/", getAllvideos)
router.post("/signed", getSigned)
router.post("/upload", isLoggedIn, currUser, uploadVideo)


module.exports = router