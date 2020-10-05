const express = require('express');
const router = express.Router();

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Sign-Up Page
router.get('/sign-up', (req, res) => res.send('sign-up'));


module.exports = router;