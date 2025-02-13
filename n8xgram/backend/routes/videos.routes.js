const express = require("express")
const router = express.Router()
const multer = require("multer")
const { uploadVideo, getAllvideos, editVideoDetails, deleteVideo } = require("../controllers/posts.controllers")
const { authMiddleware } = require("../middlewares/authmiddleware")

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
    limits: { fileSize: 4 * 1024 * 1024 },
}).single('file');

router.post("/", getAllvideos)
router.post("/upload", authMiddleware, upload, uploadVideo)
router.post("/update", authMiddleware, editVideoDetails)
router.post("/delete", authMiddleware, deleteVideo)

module.exports = router