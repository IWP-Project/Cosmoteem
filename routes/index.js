const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../config/auth')
const User = require('../models/User')

// Homepage Route
router.get('/', (req, res) => {
    res.render('home')
})

// Dashboard for User
router.get('/dashboard', auth.checkAuthenticated, async(req, res) => {
    console.log(req.session)
    const user = await User.findOne({ _id: req.session.passport.user }).populate('posts').lean()
    const userposts = await user.posts.sort((a, b) => {
        return b.voteScore - a.voteScore
    })
    const posts = await Post.find({}).sort({ voteScore: 'desc' }).limit(3).lean()
    res.render('users/dashboard', {
        user,
        userposts,
        posts
    })
})

//Profile Page of User
router.get('/profile', auth.checkAuthenticated, async(req, res) => {
    const user = await User.findOne({ _id: req.session.passport.user })
    console.log(user.username)
    res.render('users/profile', {
        user: user.username
    })
});

router.get('/home', (req, res) => res.render('home'));
router.get('/photogallery', (req, res) => res.render('gallery'));
router.get('/store', (req, res) => res.render('store'));
router.get('/topnews', (req, res) => res.render('topnews'));
router.get('/forums', (req, res) => res.render('forums'));

// Testing Purpose for handlebars
router.get('/test/createathread', (req, res) => {
    res.render('testing/createathread')
})


// Route to get all users from hard coded database
router.get('/allusers', (req, res) => res.json(users));

module.exports = router;