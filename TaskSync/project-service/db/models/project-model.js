const mongoose = require('mongoose');

const taskColumnSchema = new mongoose.Schema({
    columnId: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
        unique: true
    },
    title: {
        type: String,
        required: [true, "Column title is required"]
    },
    issues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issues"
    }],
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    totalPoints: {
        type: Number,
        default: 0
    },
    completed: {
        type: Number,
        default: 0
    }
}, { _id: false });

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please give a name to your project"]
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [] 
    }],
    taskColumns: {
        type: [taskColumnSchema],
        default: [
            { title: "Todo" },
            { title: "In Progress" },
            { title: "Done" }
        ]
    },
    admin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    managers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    logs: [String],
    settings: {
        trackingPrograms: Boolean,
        trackParticipantProgress: Boolean,
        onTimeSubmissionPoints: Number,
        beforeTimeBonus: Number,
        afterTimePenalty: Number
    },
})

// methods


// middlewares

module.exports = mongoose.model("Project", projectSchema)