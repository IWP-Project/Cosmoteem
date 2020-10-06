const express = require('express');
const { parse } = require('path');
const uuid = require('uuid');
const router = express.Router();
const users = require('../../Users');
const posts = require('../../Posts');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => res.json(users));

router.get('/:id', (req, res) => {
    const found = users.some(user => user.id === parseInt(req.params.id));

    if (found) {
        res.json(users.filter(user => user.id === parseInt(req.params.id)));
    } else {
        res.status(400).end(`No user with the id: ${req.params.id} Found `);
    }
});

// To Sign-Up and ADD user to Database
// router.post('/', async(req, res) => {
//     try {
//         const hashedPass = await bcrypt.hash(req.body.password, 10)
//         console.log(hashedPass)
//         const newUser = {
//             id: Math.floor(Math.random() * 10000),
//             username: req.body.username,
//             password: hashedPass,
//             firstname: req.body.firstname,
//             lastname: req.body.lastname,
//             email: req.body.email,
//             threads: []
//         }

//         if (!newUser.username || !newUser.email || !newUser.password || !newUser.firstname || !newUser.lastname || !req.body.cpassword) {
//             return res.status(400).json({ msg: 'Please fill all the fields' });
//         }
//         users.push(newUser);
//         //res.json(users);
//         res.render('signupdone', {
//             userid: newUser.id
//         });
//     } catch {
//         res.status(500).send()
//     }
// });

// // Login Validation and access for user
// router.post('/login', async(req, res) => {
//     const user = users.find(user => user.username = req.body.name)
//     if (user == null) {
//         return res.status(404).render('404');
//     }
//     try {
//         if (await bcrypt.compare(req.body.password, user.password)) {
//             const upvoteArray = [];
//             posts.forEach(post => {
//                 upvoteArray.push(post.upvotes);
//             });
//             upvoteArray.sort((a, b) => b - a);

//             const hotposts = [];
//             upvoteArray.forEach(upvote => {
//                 posts.forEach(post => {
//                     if (upvote === post.upvotes) {
//                         hotposts.push(post.title);
//                     }
//                 })
//             });

//             res.render('dashboard', {
//                 usersusername: user.id,
//                 userthread: user.threads,
//                 hotposts
//             })
//         } else {
//             res.send('Not Valid')
//         }
//     } catch {
//         res.status(500).send()
//     }
// })
module.exports = router;