const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');
const users = require('./Users');
const path = require('path');

//init express
const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for Handlebars templates
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Setting a Static Folder for accessing all the static files like css/js/images
app.use(express.static(__dirname + '/public'));

//Routes For pages
app.use('/', require('./routes/index'));

//Routes for user pages
//app.use('/users', require('./routes/users'));

//Route for Sign-Up and Login API
app.use('/api/users', require('./routes/api/users'));

// HomePage Route
app.get('/', (req, res) => res.render('home'));

// Define Port
const PORT = process.env.PORT || 5000;

// Listen for PORT
app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));