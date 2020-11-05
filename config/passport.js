const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Load User model
//const User = require('../models/User')

function initialize(passport) {
    const authenticateUser = async(username, password, done) => {
        // Match username
        User.findOne({ username: username })
            .then(async user => {
                if (!user)
                    return done(null, false, { message: 'That username does not exist!' })
                try {
                    // Match Password
                    if (await bcrypt.compare(password, user.password)) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: "Password Incorrect" })
                    }
                } catch (e) {
                    return done(e)
                }
            })
    }
    passport.use(new LocalStrategy({ usernameField: 'username' },
        authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}

module.exports = initialize