const express = require('express');
const users = require('../Users');
const router = express.Router();

router.get('/home', (req, res) => res.render('home'));
router.get('/photogallery', (req, res) => res.render('gallery'));
router.get('/store', (req, res) => res.render('store'));
router.get('/topnews', (req, res) => res.render('topnews'));
router.get('/forums', (req, res) => res.render('forums'));


module.exports = router;