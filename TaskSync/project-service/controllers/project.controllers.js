const { ApiError, AsyncHandler, ApiResponse } = require("../utils/ApiHelpers")
const projectModel = require("../db/models/project-model")
const axios = require("axios")
const { publishToQueue } = require("../service/rabbit")

const getAllProjects = AsyncHandler(async (req, res) => {
    res.send(req.user)
})

const getProject = AsyncHandler(async (req, res) => {
    res.send(req.user)
})

const createProject = AsyncHandler(async (req, res) => {
    const body = req.body
    const { payload } = req
    console.log(payload);

    if (!body.title) {
        throw new ApiError("Title is required", 401)
    }
    const objBluePrint = ["title", "participants", "admin", "managers", "settings"]

    Object.keys(body).forEach((data) => {
        const unexpectedObj = objBluePrint.find((blueprint) => blueprint === data)
        if (!unexpectedObj) {
            throw new ApiError("Unexpected json object", 401)
        }
    })
    try {
        const newProject = await projectModel.create({ ...body })
        await publishToQueue("new_project_created", JSON.stringify({ userid: payload, projectid: newProject.projectid }))
        const { statusCode, ...response } = new ApiResponse("Project has been created successfully", 200, newProject)
        res.status(statusCode).json(response)
    } catch (error) {
        console.log(error);
        throw new ApiError("Failed to create your project", 500)
    }
})
const updateProject = (req, res) => {

}
const deletProject = (req, res) => {

}

//

const addParticipants = (reqm, res) => {

}


module.exports = {
    getAllProjects,
    getProject,
    createProject,
    updateProject,
    deletProject,

    addParticipants,
}