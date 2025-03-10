const path = require("path");
const vdoClient = require("../config/apivdo");
const { dbconnect } = require("../db/db.connection");
const userModel = require("../db/db.usermodel");
const postModel = require("../db/db.postmodel")
const fs = require("fs")
const cloudinary = require('cloudinary').v2

const cache = {}

module.exports.uploadVideo = async (req, res) => {
    const body = req.body
    const currentUser = req.user

    await dbconnect()

    try {
        const user = await userModel.findById(currentUser._id)
        if (!user) {
            return res.status(404).json("User not found")
        }
        body.tags = body.tags.split(',')
        body.author = currentUser._id
        console.log(body);

        const newPost = await postModel.create({ ...body })
        user.posts.push(newPost._id)
        await user.save()

        return res.status(200).json({ message: "success", newPost, user })
    } catch (error) {

    }
};

module.exports.getSigned = async (req, res) => {
    const body = req.body
    const signature = cloudinary.utils.api_sign_request(body.paramsToSign, process.env.CLOUDINARY_API_SECRET);
    res.status(200).json({
        signature,
    });
};

module.exports.getAllvideos = async (req, res) => {
    const page = req.body.page || 1;
    const limit = req.body.limit || 10;
    const skip = (page - 1) * limit;

    try {
        await dbconnect();
        const posts = await postModel.find({})
            .populate("author", "username image _id followers followings")
            .skip(skip)
            .limit(limit);
        const totalCount = await postModel.countDocuments({});
        return res.status(200).json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Cannot get videos at the moment!", message: error });
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

    if (cache.deletingVideo) return res.status(102).json({ message: "Your post is being deleted please wait." })

    if (!videoId || !userid) {
        return res.status(400).json({ error: "Cannot delete your post at the moment" })
    } else {
        cache.deletingVideo = true
        setTimeout(() => {
            delete cache.deletingVideo
        }, 8000)
    }
    try {
        await vdoClient.videos.delete(videoId)
        await userModel.findByIdAndUpdate(userid, { $pull: { posts: { videoId } } });

        return res.status(200).json({ message: "succes" })
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong", details: error })
    }
}
