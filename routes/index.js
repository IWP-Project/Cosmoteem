const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const users = require('../Users');
const posts = require('../Posts');

// Homepage Route
router.get('/', (req, res) => {
    res.render('home')
})

router.get('/home', (req, res) => res.render('home'));
router.get('/photogallery', (req, res) => res.render('gallery'));
router.get('/store', (req, res) => res.render('store'));
router.get('/topnews', (req, res) => res.render('topnews'));
router.get('/forums', (req, res) => res.render('forums'));


// Route to get all users from hard coded database
router.get('/allusers', (req, res) => res.json(users));

module.exports = router;