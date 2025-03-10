const express = require('express')
const router = express.Router()
const { getCurrUserProfile, getProfile } = require('../controllers/user.controllers')
const { currUser } = require('../middlewares/auth-middleware')

router.get("/profile", currUser, getCurrUserProfile)
router.post("/profile", currUser, getProfile)

module.exports = router