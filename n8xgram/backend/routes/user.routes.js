const express = require("express")
const router = express.Router({mergeParams: true})
const { getAllUsers, deleteUserById, logout, updateUser, followController, userProfile, uploadProfileImage } = require("../controllers/user.controllers")
const { uploadVideo, editVideoDetails, deleteVideo } = require("../controllers/posts.controllers")
const multer = require("multer")

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');
 
//user routes
router.get("/", userProfile)
router.get("/allusers", getAllUsers)
router.delete("/delete", deleteUserById)
router.get("/logout", logout)
router.post("/update", updateUser)
router.put("/follow/:tofollow", followController)
router.post("/updprofimg", upload, uploadProfileImage)

// video or post
router.post("/videos/upload", upload, uploadVideo)
router.post("/videos/update", editVideoDetails)
router.post("/videos/delete", deleteVideo)


module.exports = router