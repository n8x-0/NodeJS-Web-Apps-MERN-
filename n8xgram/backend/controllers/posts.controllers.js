const path = require("path");
const vdoClient = require("../config/apivdo");
const { dbconnect } = require("../db/db.connection");
const userModel = require("../db/db.usermodel");
const fs = require("fs")

module.exports.uploadVideo = async (req, res) => {
    const file = req.file;
    const { userid } = req.params
    let { payload } = req.body;
    payload = JSON.parse(payload)

    if (!file) {
        return res.status(400).json({ error: "Please Choose a file" });
    }
    try {
        const videoObject = await vdoClient.videos.create(payload);
        const uploadVideo = await vdoClient.videos.upload(videoObject.videoId, file.path);

        console.log("vdo: =======", uploadVideo);
        fs.unlinkSync(file.path);

        if (uploadVideo) {
            try {
                await dbconnect();
                const updateUsersPosts = await userModel.findById(userid);
                updateUsersPosts.posts.push(uploadVideo.videoId);
                await updateUsersPosts.save();

                return res.status(200).json({ message: "success" });
            } catch (error) {
                console.log(error);
                await vdoClient.videos.delete(videoObject.videoId)
                return res.status(500).json({ error: "Something went wrong" });
            }
        }
        return res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error);
        // await vdoClient.videos.delete(videoObject.videoId)
        return res.status(500).json({ error: "Something went wrong" });
    }
};

module.exports.getAllvideos = async (req, res) => {
    const page = req.body.page || 1
    const filterId = req.body.userid || null

    console.log(req.body);

    if (filterId) {
        const vdosList = await vdoClient.videos.list({
            headers: { "Content-Type": "application/json" },
            metadata: { "authorId": filterId }
        });
        console.log("specific user posts");
        return res.status(200).json(vdosList)
    }

    try {
        const vdosList = await vdoClient.videos.list({ currentPage: page, pageSize: 3 })
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

module.exports.editVideoDetails = async (req, res) => {
    const body = req.body

    if (!body.videoId) {
        return res.status(400).json({ error: "Video Id is required." })
    }

    const payload = {
        ...body
    }
    console.log(payload);

    try {
        const update = vdoClient.videos.update(body.videoId, payload)
        return res.status(200).json(update)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "something went wrong", error })
    }
}

module.exports.deleteVideo = async (req, res) => {
    const { videoId, userid } = req.body

    if (!videoId || !userid) {
        return res.status(400).json({ error: "Cannot delete your post at the moment" })
    }
    try {
        await vdoClient.videos.delete(videoId)
        await userModel.findByIdAndUpdate(userid, { $pull: { posts: { videoId } } });

        return res.status(200).json({ message: "succes" })
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong", details: error })
    }
}
