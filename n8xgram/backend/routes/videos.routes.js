const express = require("express")
const router = express.Router()
const multer = require("multer")
const { uploadVideo, getAllvideos } = require("../controllers/posts.controllers")

const upload = multer({ dest: "upload" })

router.post("/", getAllvideos)
router.post("/upload", upload.single('file'), uploadVideo)

module.exports = router