const vdoClient = require("../config/apivdo")
const { dbconnect } = require("../db/db.connection")
const userModel = require("../db/db.usermodel")

module.exports.uploadVideo = async (req, res) => {
    const file = req.file
    let { id, title, description, tags, username, userImage } = req.body
    tags = JSON.parse(tags)

    if (!id) {
        return res.status(401).json({ error: "Please login first" })
    }
    if (!file) {
        return res.status(400).json({ error: "Please Choose a file" })
    }
    if (!title) {
        title = file.originalname
    }

    try {
        const videoObject = await vdoClient.videos.create({
            title,
            description,
            tags: tags,
            metadata: [
                { key: "authorId", value: id },
            ],
        })
        const uploadVideo = await vdoClient.videos.upload(videoObject.videoId, file.path)

        if (uploadVideo) {
            await dbconnect()
            const updateUsersPosts = await userModel.findById(id)
            updateUsersPosts.posts.push({ videoId: uploadVideo.videoId });
            await updateUsersPosts.save()
            console.log("done");
        }
        return res.status(200).json({ updateUsersPosts, message: "success" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" })
    }
}

module.exports.getAllvideos = async (req, res) => {
    const page = req.body.page
    const filterId = req.body.userid
    
    console.log(req.body);
    
    if (filterId) {
        const vdosList = await vdoClient.videos.list({
            currentPage: page,
            pageSize: 2,
            metadata: { "authorId": filterId } 
        });
        console.log("specific user posts");
        return res.status(200).json(vdosList)
    }

    try {
        const vdosList = await vdoClient.videos.list({ currentPage: page, pageSize: 2 })

        const usersid = vdosList.data.map((data) => data.metadata[0].value)

        try {
            await dbconnect()
            const users = await userModel.find({ _id: { $in: usersid } }).select("username image followers followings");
            
            const userMap = users.reduce((map, user) => {
                map[user._id.toString()] = user;
                return map;
            }, {});

            const videosWithAuthors = vdosList.data.map((video) => ({
                ...video,
                author: userMap[video.metadata[0].value],
            }));

            console.log(videosWithAuthors);

            return res.status(200).json(videosWithAuthors)
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "cannot get videos at the momment !", message: error })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "cannot get videos at the momment !", message: error })
    }
}