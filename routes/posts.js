const express = require('express');
const router = express.Router();
const multer = require('multer')
const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comments')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const auth = require('../config/auth')
const mongoose = require('mongoose');
const uploadPath = path.join('public', Post.attachmentBasePath)
const imageMimeTypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// Threads for non logged in user
router.get('/', async(req, res) => {
    try {
        const searchOptions = {}
        if (req.query.title !== null && req.query.title !== '') {
            searchOptions.title = new RegExp(req.query.title, 'i')
        }
        const posts = await Post.find(searchOptions).sort({ date: 'desc' }).populate('author')
        console.log('--------------------------------------------------------------------------------------------------------')
        res.render('posts/all', {
            posts: posts.map(post => post.toJSON()),
            searchOptions: req.query,
            userposts: false
        })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

// Single Thread Page GET Route
router.get('/post/:_id', async(req, res) => {
    try {
        //const post = await Post.findOne({ _id: req.params._id }).populate({ path: 'comments', populate: { path: 'author' } }).lean({ virtuals: true })
        const post = await Post.findOne({ _id: req.params._id }).populate({ path: 'author comments', populate: { path: 'author' } }).lean({ virtuals: true })
        const postcomments = await post.comments
            // Find Logged in User
        let user = false
        if (req.isAuthenticated()) {
            user = await User.findOne({ _id: req.session.passport.user }).lean()
        }
        res.render('posts/post', {
            post,
            postcomments,
            user
        })
    } catch (e) {
        console.log(e)
        res.redirect('/posts')
    }
})

// Thread View and comment GET route
router.get('/thread/:_id', async(req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params._id }).populate({ path: 'author comments', populate: { path: 'author' } }).lean({ virtuals: true })
        const postcomments = await post.comments
            // Find Logged in User
        let user = false
        if (req.isAuthenticated()) {
            user = await User.findOne({ _id: req.session.passport.user }).lean()
        }
        res.render('posts/thread', {
            post,
            postcomments,
            user
        })
    } catch (e) {
        console.log(e)
        res.redirect('/posts')
    }
})

// All and Search Posts GET Route
router.get('/all', auth.checkAuthenticated, async(req, res) => {
    try {
        const searchOptions = {}
        if (req.query.title !== null && req.query.title !== '') {
            searchOptions.title = new RegExp(req.query.title, 'i')
        }
        const user = await User.findOne({ _id: req.session.passport.user }).populate('posts').lean()
        const posts = await Post.find(searchOptions).sort({ date: 'desc' }).populate('author')
        console.log('--------------------------------------------------------------------------------------------------------')
        res.render('posts/all', {
            posts: posts.map(post => post.toJSON()),
            searchOptions: req.query,
            userposts: user.posts
        })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

// Route for Each Forum Category Page 
router.get('/category/:name', async(req, res) => {
    try {
        const posts = await Post.find({ tags: req.params.name }).sort({ voteScore: 'desc' }).populate('author').lean()
        const tag = req.params.name.toUpperCase()
        res.render('posts/forumscategory', {
            posts,
            tag
        })
    } catch (e) {
        console.log(e)
    }
})

// Create Thread GET Route
router.get('/newpost', auth.checkAuthenticated, async(req, res) => {
    try {
        res.render('posts/newpost', { post: new Post() })
    } catch {
        res.redirect('/posts')
    }
})

// Create Thread POST Route
router.post('/newpost', auth.checkAuthenticated, upload.single('cover'), async(req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const { tags, title, body } = req.body
    const newPost = new Post({
        _id: new mongoose.Types.ObjectId(),
        tags,
        title,
        author: req.session.passport.user,
        attachments: fileName,
        body,
        upVotes: [],
        downVotes: [],
        voteScore: 0
    })
    errors = []
        // Check for all fields
    if (!title || !body)
        errors.push({ msg: 'Please fill in the title and/or the body!' })
        //Validation doesn't pass
    if (errors.length > 0) {
        if (newPost.attachments != null)
            removeAttachment(newPost.attachments)
        res.render('posts/newpost', {
            title,
            body,
            errorMessage: errors
        })
    } else {
        try {
            const post = await newPost.save()
            const user = await User.findOne({ _id: req.session.passport.user })
            user.posts.push(newPost._id)
            const uuser = await user.save()
            try {
                req.flash('success_msg', 'You have created the Post successfully')
                res.redirect("/posts/all")
            } catch (e) {
                if (newPost.attachments != null)
                    removeAttachment(newPost.attachments)
                console.log(e)
                res.redirect('/posts/newpost')
            }
        } catch (err) {
            if (newPost.attachments != null)
                removeAttachment(newPost.attachments)
            console.log(err)
        }

    }

})

// Create a Comment POST route
router.post('/post/:_id/comments', async(req, res) => {
    const { body } = req.body
    const post = await Post.findOne({ _id: req.params._id })
    postcomments = await post.comments
    const newComment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        body,
        author: req.session.passport.user
    })
    errors = []
        // Check for all fields
    if (!body)
        errors.push({ msg: 'Comment can not be Blank!' })
        //Validation doesn't pass
    if (errors.length > 0) {
        req.flash('error_msg', 'Comment can not be Blank!')
        res.redirect('/posts/post/' + req.params._id)
    } else {
        try {
            const comment = await newComment.save()
            post.comments.push(newComment._id)
            const upost = await post.save()
            try {
                req.flash('success_msg', 'You have commented successfully')
                res.redirect("/posts/post/" + req.params._id)
            } catch (e) {
                console.log(e)
                res.redirect('/posts/post' + req.params._id)
            }
        } catch (err) {
            console.log(err)
        }
    }
})

// Route for Vote up and Vote down on Posts
router.put('/post/:_id/vote-up', auth.checkAuthenticated, async(req, res) => {
    const post = await Post.findById(req.params._id)
    try {
        var flag = 0
        var index = await post.downVotes.length - 1
        var uindex = await post.upVotes.length - 1
        while (index >= 0) {
            if (post.downVotes[index] == req.session.passport.user) {
                post.downVotes.splice(index, 1)
                post.voteScore = post.voteScore + 1
            }
            index -= 1
        }
        while (uindex >= 0) {
            if (post.upVotes[uindex] == req.session.passport.user) {
                post.upVotes.splice(uindex, 1);
                post.voteScore = post.voteScore - 1
                flag = 1
            }
            uindex -= 1
        }

        if (flag === 0) {
            post.upVotes.push(req.session.passport.user);
            post.voteScore = post.voteScore + 1;
        }
        post.save();
        res.status(200);
    } catch (e) {
        console.log(e)
    }
})
router.put('/post/:_id/vote-down', auth.checkAuthenticated, async(req, res) => {
    const post = await Post.findById(req.params._id)
    try {
        var flag = 0
        var index = await post.downVotes.length - 1
        var uindex = await post.upVotes.length - 1
        while (index >= 0) {
            if (post.downVotes[index] == req.session.passport.user) {
                post.downVotes.splice(index, 1)
                post.voteScore = post.voteScore + 1
                flag = 1
            }
            index -= 1
        }
        while (uindex >= 0) {
            if (post.upVotes[uindex] == req.session.passport.user) {
                post.upVotes.splice(uindex, 1);
                post.voteScore = post.voteScore - 1
            }
            uindex -= 1
        }
        if (flag === 0) {
            post.downVotes.push(req.session.passport.user);
            post.voteScore = post.voteScore - 1;
        }
        post.save();
        res.status(200);
    } catch (e) {
        console.log(e)
    }
})

function removeAttachment(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}


module.exports = router;