const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => res.render('home'));
router.get('/login', (req, res) => res.render('login'));
router.get('/sign-up', (req, res) => res.render('signup'));
router.get('/photogallery', (req, res) => res.render('gallery'));
router.get('/dashboard', (req, res) => res.render('dashboard'));



module.exports = router;