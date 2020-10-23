const mongoose = require('mongoose')
const path = require('path')
const attachmentBasePath = 'uploads/postAttachments'
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const postSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    attachments: {
        type: String
    },
    tags: {
        type: String
    },
    upvotes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    }]
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

postSchema.virtual('attachmentImgPath').get(function() {
    if (this.attachments != null) {
        return path.join('/', attachmentBasePath, this.attachments)
    }
})

postSchema.plugin(mongooseLeanVirtuals)

module.exports = mongoose.model('Post', postSchema)
module.exports.attachmentBasePath = attachmentBasePath