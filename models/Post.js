const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String,
        default: "admin"
    },
    tags: {
        type: String
    },
    upvotes: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Post', postSchema)