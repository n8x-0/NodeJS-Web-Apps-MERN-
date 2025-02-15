const express = require("express")
const router = express.Router()
const {getAllvideos } = require("../controllers/posts.controllers")

router.post("/", getAllvideos)

module.exports = router