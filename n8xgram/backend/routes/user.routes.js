const express = require("express")
const router = express.Router({ mergeParams: true })
const { getAllUsers, deleteUserById, logout, updateUser, followController, userProfile, uploadProfileImage } = require("../controllers/user.controllers")
const { uploadVideo, editVideoDetails, deleteVideo } = require("../controllers/posts.controllers")
const multer = require("multer")
const path = require("path")

const storage = multer.memoryStorage();
const imgUpload = multer({ storage }).single('file');

const videoUpload = multer({ dest: "upload" }).single('file');

//user routes
router.get("/", userProfile)
router.get("/allusers", getAllUsers)
router.delete("/delete", deleteUserById)
router.get("/logout", logout)
router.post("/update", updateUser)
router.put("/follow/:tofollow", followController)
router.post("/updprofimg", imgUpload, uploadProfileImage)

// video or post
router.post("/videos/upload", videoUpload, uploadVideo)
router.post("/videos/update", editVideoDetails)
router.post("/videos/delete", deleteVideo)


module.exports = router