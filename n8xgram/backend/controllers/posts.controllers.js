const path = require("path");
const vdoClient = require("../config/apivdo");
const { dbconnect } = require("../db/db.connection");
const userModel = require("../db/db.usermodel");

module.exports.uploadVideo = async (req, res) => {
    const file = req.file;
    let { id, title, description, tags } = req.body;
    tags = JSON.parse(tags);

    if (!id) {
        return res.status(401).json({ error: "Please login first" });
    }
    if (!file) {
        return res.status(400).json({ error: "Please Choose a file" });
    }
    if (!title) {
        title = file.originalname;
    }

    let payload = { description, tags }
    if (!description) delete payload.description
    if (!tags || tags.length == 0 || tags[0] === '') delete payload.tags

    console.log(payload);

    try {
        const videoObject = await vdoClient.videos.create({
            title,
            ...payload,
            playerId: "pt2OBhuBhqouEklPSIZWmBMP",
            metadata: [{ key: "authorId", value: id }],
        });

        const resolvedPath = path.resolve(file.destination, file.filename);
        console.log("Resolved file path:", resolvedPath);
        console.log(file.path);
        
        const uploadVideo = await vdoClient.videos.upload(videoObject.videoId, file.path);
        console.log("vdo: =======", uploadVideo);

        if (uploadVideo) {
            try {
                await dbconnect();
                const updateUsersPosts = await userModel.findById(id);
                updateUsersPosts.posts.push({ videoId: uploadVideo.videoId });
                await updateUsersPosts.save();

                return res.status(200).json({ message: "success" });
            } catch (error) {
                console.log(error);
                await vdoClient.videos.delete(videoObject.videoId)
                return res.status(500).json({ error: "Something went wrong" });
            }
        }
    } catch (error) {
        console.log(error);
        await vdoClient.videos.delete(videoObject.videoId)
        return res.status(500).json({ error: "Something went wrong" });
    }
};

module.exports.getAllvideos = async (req, res) => {
    const page = req.body.page || 1
    const filterId = req.body.userid || null

    console.log(req.body);

    if (filterId) {
        const vdosList = await vdoClient.videos.list({
            currentPage: page,
            headers: { "Content-Type": "application/json" },
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
    const vdoId = req.body.videoId
    console.log(vdoId);
    if (vdoId) {
        return res.status(400).json({ error: "Cannot delete your post at the moment" })
    }
    try {
        await vdoClient.videos.delete(vdoId)
        return res.status(200).json({ message: "sucess" })
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong", details: error })
    }
}
