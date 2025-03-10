const express = require('express')
const { createProject, updateProject, deletProject, getAllProjects, getProject, addParticipants } = require('../controllers/project.controllers')
const router = express.Router()

router.get("/projects", getAllProjects)
router.get("/project", getProject)
router.post("/project", createProject)
router.post("/project/:projectid", updateProject)
router.delete("/project/:projectid", deletProject)

router.post("/add-participants", addParticipants)

module.exports = router