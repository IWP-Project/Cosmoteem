const express = require('express');
const router = express.Router();
const users = require('../Users');

router.get('/home', (req, res) => res.render('home'));
router.get('/login', (req, res) => res.render('login'));
router.get('/sign-up', (req, res) => res.render('signup'));
router.get('/photogallery', (req, res) => res.render('gallery'));
router.get('/dashboard', (req, res) => res.render('dashboard'));
router.get('/store', (req, res) => res.render('store'));
router.get('/topnews', (req, res) => res.render('topnews'));
router.get('/forums', (req, res) => res.render('forums'));




module.exports = router;