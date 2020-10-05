const express = require('express');
const { parse } = require('path');
const uuid = require('uuid');
const router = express.Router();
const users = require('../../Users');

router.get('/', (req, res) => res.json(users));

router.get('/:id', (req, res) => {
    const found = users.some(user => user.id === parseInt(req.params.id));

    if (found) {
        res.json(users.filter(user => user.id === parseInt(req.params.id)));
    } else {
        res.status(400).end(`No user with the id: ${req.params.id} Found `);
    }
});

router.post('/', (req, res) => {
    const newUser = {
        id: Math.floor(Math.random() * 10000),
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        threads: []
    }

    if (!newUser.username || !newUser.email || !newUser.password || !newUser.firstname || !newUser.lastname || !req.body.cpassword) {
        return res.status(400).json({ msg: 'Please fill all the fields' });
    }
    users.push(newUser);
    //res.json(users);
    res.render('signupdone', {
        userid: newUser.id
    });
});

module.exports = router;