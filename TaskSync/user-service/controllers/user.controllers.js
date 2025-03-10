const { AsyncHandler, ApiError, ApiResponse } = require("../utils/ApiHelpers")
const userModel = require("../db/models/user-model")
const { subscribeToQueue } = require("../service/rabbit")

const getCurrUserProfile = AsyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

const getProfile = AsyncHandler(async (req,res)=> {
    const {userid} = req.body

    if(!userid){
        throw new ApiError("User not found", 404)
    }
    try {
        const isUser = await userModel.findById(userid);
        if(!isUser){
            throw new ApiError("User not found", 404)
        }
        const {statusCode , ...response} = new ApiResponse("User found", 200, isUser)
        res.status(statusCode).json(response)
    } catch (error) {
        throw new ApiError("Failed to get user profile", 500)
    }
})

module.exports = {
    getCurrUserProfile,
    getProfile
}

subscribeToQueue("new_project_created", async (data) => {
    const { userid, projectid } = JSON.parse(data);
    const user = await userModel.findById(userid);
    console.log(user);
    
    user.projects.push(projectid);
    await user.save();
    console.log("project created and saved in user obj");
});