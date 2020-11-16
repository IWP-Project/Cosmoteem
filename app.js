// Environment variables require
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Require Express
const express = require('express')
    // Init express
const app = express()

// Require Handlebars
const exphbs = require('express-handlebars')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const methodOverride = require('method-override')
const cron = require('node-cron')

const rss = require('./config/rss')
cron.schedule('* */6 * * *', rss.parse)



// Mongo DB Config
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


// Init of Login Passport
const intiliazePassport = require('./config/passport')
intiliazePassport(
    passport
)
var hbs = exphbs.create({})
    // Equal to Helper for Handlebars
hbs.handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

// Middleware for Handlebars templates
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Express Flash and Session
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()

})

// Setting a Static Folder for accessing all the static files like css/js/images
app.use(express.static(__dirname + '/public'));




// --------------- ROUTES ----------------- //

const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')
const postRouter = require('./routes/posts')

// Index Pages Routing
app.use('/', indexRouter)
    // User Pages Routing
app.use('/users', userRouter)
    // User Pages Routing
app.use('/posts', postRouter)
    // API to show userlist
app.use('/api/users', require('./routes/api/users'))

// Define Port
const PORT = process.env.PORT || 5000;

// Listen for PORT
app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));