const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    description: {
        type: String,
        default: "Welcome to the n8xgram"
    },
    secure_url: {
        type: String,
        required: true
    },
    thumbnail_url: {
        type: String,
        required: true
    },
    original_filename: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    resource_type: {
        type: String,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    bytes: {
        type: Number,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        comment: String
    }],
})

//middleware

postSchema.pre("save", (next)=> {
    if(!this.title || this.title.trim() === ''){
        this.title = `VID-${Date.now()}n8x-${Math.floor(Math.random() * 1000)}`
    }
    next()
})

module.exports = mongoose.model("Post", postSchema)

