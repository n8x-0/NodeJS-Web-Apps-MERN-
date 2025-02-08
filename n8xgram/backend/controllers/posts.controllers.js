const vdoClient = require("../config/apivdo")
const { dbconnect, disconnectDB } = require("../db/db.connection")
const userModel = require("../db/db.usermodel")

module.exports.uploadVideo = async (req, res, next) => {
    const file = req.file
    let { id, title, description } = req.body
    console.log(file, id);

    if (!id) {
        return res.status(400).json({ error: "Please login first" })
    }
    if (!file) {
        return res.status(400).json({ error: "no File" })
    }
    if (!title) {
        title = file.originalname
    }

    try {
        const videoObject = await vdoClient.videos.create({ title, description })
        const uploadVideo = await vdoClient.videos.upload(videoObject.videoId, file.path)

        if(uploadVideo){
            await dbconnect()
            const updateUsersPosts = await userModel.findById(id)
            updateUsersPosts.posts.push({videoId: uploadVideo.videoId, authorId: id})
            await updateUsersPosts.save()

            return res.status(200).json({ updateUsersPosts, message: "success" })
        }
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong" })
    }finally{
        await disconnectDB()
    }
}

module.exports.getAllvideos = async (req, res) => {
    const page = req.body.page
    
    try {
        const vdosList = await vdoClient.videos.list({ currentPage: page, pageSize: 2 })
        return res.status(200).json(vdosList)
    } catch (error) {
        return res.status(500).json({ error: "cannot get videos at the momment !", message: error })
    }
}