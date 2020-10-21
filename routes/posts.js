const express = require('express');
const router = express.Router();
const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const auth = require('../config/auth')

// All and Search Posts GET Route
router.get('/', async(req, res) => {
    try {
        const searchOptions = {}
        if (req.query.title !== null && req.query.title !== '') {
            searchOptions.title = new RegExp(req.query.title, 'i')
        }
        const posts = await Post.find(searchOptions).sort({ date: 'desc' })
        res.render('posts/all', {
            posts: posts.map(post => post.toJSON()),
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// Create Thread GET Route
router.get('/newpost', async(req, res) => {
    try {
        res.render('posts/newpost', { post: new Post() })
    } catch {
        res.redirect('/posts')
    }
})

// Create Thread POST Route
router.post('/newpost', async(req, res) => {
    const { tags, title, body } = req.body
    errors = []
        // Check for all fields
    if (!title || !body)
        errors.push({ msg: 'Please fill in the title and/or the body!' })
        //Validation doesn't pass
    if (errors.length > 0) {
        res.render('posts/newpost', {
            title,
            body,
            errorMessage: errors
        })
    } else {
        try {
            const newPost = new Post({
                tags,
                title,
                body
            })
            const post = await newPost.save()
            try {
                req.flash('success_msg', 'You have created the Post successfully')
                res.redirect("/posts")
            } catch (e) {
                console.log(e)
                res.redirect('/posts/newpost')
            }
        } catch (err) {
            console.log(err)
            console.log('Hi')
        }

    }

})

module.exports = router;