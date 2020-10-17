const express = require('express');
const router = express.Router();
const User = require('../models/user')

// All Users Route
router.get('/', async(req, res) => {
    try {
        const searchOptions = {}
        if (req.query.username !== null && req.query.username !== '') {
            searchOptions.username = new RegExp(req.query.username, 'i')
        }
        const users = await User.find(searchOptions)
        res.render('users/index', {
            users: users.map(user => user.toJSON()),
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New User Route
router.get('/new', (req, res) => {
    res.render('users/new', { user: new User() })
})

// Create User Route
router.post('/', async(req, res) => {
    const user = new User({
        id: Math.floor(Math.random() * 10000),
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        threads: []
    })
    try {
        const newUser = await user.save()
            // res.redirect(`users/${newUser.id}`)
        res.redirect('users')
    } catch {
        res.render('users/new', {
            user: user,
            errorMessage: 'Error creating User'
        })
    }
})




module.exports = router;