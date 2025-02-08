const mongoose = require("mongoose")

const userModel = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "https://i.pinimg.com/1200x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg" },
    posts: [{
        videoId: { type: String },
        authorId: { type: mongoose.Schema.ObjectId, ref: "user" }
    }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
}, { timestamps: true })

module.exports = mongoose.model("User", userModel)