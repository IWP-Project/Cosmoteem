const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../config/auth')
const User = require('../models/User')

// Homepage Route
router.get('/', (req, res) => {
    res.render('home', { layout: 'home_layouts' })
})

// Dashboard for User
router.get('/dashboard', auth.checkAuthenticated, async(req, res) => {
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

router.get('/home', (req, res) => res.render('home', { layout: 'home_layouts' }));
router.get('/photogallery', (req, res) => res.render('gallery'));
router.get('/store', (req, res) => res.render('store'));
router.get('/topnews', (req, res) => res.render('topnews'));
router.get('/help', (req, res) => res.render('help'));

router.get('/news/headlines', async(req, res) => {
    res.render('news/headlines')
})

router.get('/news/article', async(req, res) => {
    res.render('news/fullarticle')
})

router.get('/forums', async(req, res) => {
    const cposts = await Post.find({ tags: 'community' }).populate('author').sort({ voteScore: 'desc' }).limit(5).lean()
    const aposts = await Post.find({ tags: 'astronomy' }).populate('author').sort({ voteScore: 'desc' }).limit(5).lean()
    const gposts = await Post.find({ tags: 'gaming' }).populate('author').sort({ voteScore: 'desc' }).limit(5).lean()
    const fposts = await Post.find({ tags: 'faq' }).populate('author').sort({ voteScore: 'desc' }).limit(5).lean()
    const eposts = await Post.find({ tags: 'equipment' }).populate('author').sort({ voteScore: 'desc' }).limit(5).lean()
    const rposts = await Post.find({ tags: 'review' }).populate('author').sort({ voteScore: 'desc' }).limit(5).lean()
    const users = await User.find({}).lean()
    const posts = await Post.find({}).lean()
    const ulen = users.length
    const plen = posts.length
    res.render('forums', {
        cposts,
        aposts,
        gposts,
        fposts,
        eposts,
        rposts,
        users,
        ulen,
        plen
    })
});

router.get('/planetarium', (req, res) => res.render('planetarium'));


// Route to get all users from hard coded database
router.get('/allusers', (req, res) => res.json(users));


module.exports = router;