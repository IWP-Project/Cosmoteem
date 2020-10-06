const express = require('express');
const users = require('../Users');
const router = express.Router();

// Display All Users
router.get('/', (req, res) => res.json(users));

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Sign-Up Page
router.get('/sign-up', (req, res) => res.send('sign-up'));


module.exports = router;