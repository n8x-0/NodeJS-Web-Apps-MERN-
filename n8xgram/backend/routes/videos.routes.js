const express = require("express")
const router = express.Router()
const multer = require("multer")
const { uploadVideo, getAllvideos } = require("../controllers/posts.controllers")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "/tmp"); // Vercel's tmp directory
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
}).single('file');

router.post("/", getAllvideos)
router.post("/upload", upload, uploadVideo)

module.exports = router