const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    upvotes: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Comments', commentSchema)