var Discogs = require('disconnect').Client;
var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var session = require('express-session');
var bodyParser = require('body-parser');

var dotenv = require('dotenv').config();

var mongo = require('mongodb');
var mongoose = require('mongoose');

var passport = require('passport');
var flash = require('connect-flash');

var DB_USER = process.env.DB_USER;
var DB_PASSWD = process.env.DB_PASSWD;
var DB_URI = process.env.DB_URI;

mongoose.connect('mongodb://' + DB_USER + ':' + DB_PASSWD + '@' + DB_URI);
var db = mongoose.connection;

var routes = require('./routes/index');
var collection = require('./routes/collection');
var prices = require('./routes/price');
var admin = require('./routes/admin');
var auth = require('./routes/auth');
var playhistory = require('./routes/playhistory');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Passport init
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/collection', collection);
app.use('/prices', prices);
app.use('/admin', admin);
app.use('/auth', auth);
app.use('/playhistory', playhistory);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
    console.log('Server started on port '+app.get('port'));
});
