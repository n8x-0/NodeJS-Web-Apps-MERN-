const express = require("express")
const router = express.Router()
const multer = require("multer")
const { uploadVideo, getAllvideos } = require("../controllers/posts.controllers")

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');
 

router.post("/", getAllvideos)
router.post("/upload", upload, uploadVideo)

module.exports = router