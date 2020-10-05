const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const users = require('../Users');
const posts = require('../Posts');


router.get('/home', (req, res) => res.render('home'));
router.get('/login', (req, res) => res.render('login'));
router.get('/sign-up', (req, res) => res.render('signup'));
router.get('/photogallery', (req, res) => res.render('gallery'));
router.get('/dashboard', (req, res) => res.render('dashboard'));

// Route to get all users from hard coded database
router.get('/allusers', (req, res) => res.json(users));

router.get('/dashboard/:id', (req, res) => {
    const found = users.some(user => user.id === parseInt(req.params.id));

    if (found) {
        users.forEach(user => {
            if (user.id === parseInt(req.params.id)) {
                usersusername = user.username;
                userthreads = user.threads;
            }
        });
        const upvoteArray = [];
        posts.forEach(post => {
            upvoteArray.push(post.upvotes);
        });
        upvoteArray.sort((a, b) => b - a);

        const hotposts = [];
        upvoteArray.forEach(upvote => {
            posts.forEach(post => {
                if (upvote === post.upvotes) {
                    hotposts.push(post.title);
                }
            })
        });


        res.render('dashboard', {
            usersusername,
            userthreads: userthreads,
            hotposts: hotposts
        });
    } else {
        res.status(404).render('404');
    }
});



module.exports = router;