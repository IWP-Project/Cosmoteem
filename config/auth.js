//Check Authentication
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error_msg', 'Please Login to view this resource')
    res.redirect('/users/login')
}

// Check NOT Authentication

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        req.flash('error_msg', 'You are already Logged in!')
        return res.redirect(307, '/dashboard')
    }
    next()
}


module.exports = { checkAuthenticated, checkNotAuthenticated }