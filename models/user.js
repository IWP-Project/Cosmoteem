const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    threads: {
        type: Array
    }
})

module.exports = mongoose.model('User', userSchema)