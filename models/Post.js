const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    tags: [{
        type: String
    }],
    upvotes: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Post', postSchema)