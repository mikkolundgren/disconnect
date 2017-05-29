var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport); // pass passport for configuration

router.get('/facebook', passport.authenticate('facebook', { scope: 'email'}));

router.get('/facebook/callback', 
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;