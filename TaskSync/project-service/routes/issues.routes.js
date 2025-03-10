const express = require('express')
const { updateIssue, deleteIssue, getIssue, createIssue } = require('../controllers/issue.controllers')
const router = express.Router()

router.get("/issue/:issueid", getIssue)
router.post("/issue", createIssue)
router.put("/issue/:issueid", updateIssue)
router.delete("/issue/:issueid", deleteIssue)

module.exports = router