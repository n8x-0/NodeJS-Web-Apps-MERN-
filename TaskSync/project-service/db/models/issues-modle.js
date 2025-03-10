const mongoose = require('mongoose');

const issuesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"]
    },
    description: String,
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    status: ["todo", "inProgress", "completed"],
    chat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }],
    deadline: Date,
    points: Number
})

// methods


// middlewares

module.exports = mongoose.model("Issues", issuesSchema)