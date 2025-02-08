const express = require("express")
const router = express.Router()
const { getAllUsers, deleteUserById, logout, updateUser, followController, userProfile, uploadProfileImage } = require("../controllers/user.controllers")
const { authMiddleware } = require("../middlewares/authmiddleware")
const multer = require("multer")

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');
 
router.use(authMiddleware)
//user routes
router.get("/:userid", userProfile)
router.get("/:userid/allusers", getAllUsers)
router.delete("/:userid/delete", deleteUserById)
router.get("/:userid/logout", logout)
router.post("/:userid/update", updateUser)
router.put("/:userid/follow/:tofollow", followController)
router.post("/:userid/updprofimg", upload, uploadProfileImage)

module.exports = router