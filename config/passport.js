var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');


module.exports = function(passport) {

    passport.use(new FacebookStrategy({
        clientID     : configAuth.facebookAuth.clientID,
        clientSecret : configAuth.facebookAuth.clientSecret,
        callbackURL  : configAuth.facebookAuth.callbackURL
    },

    // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {
            process.nextTick(function() { 
                console.log("FB profile %j", profile); 
                if (profile.displayName == 'Mikko Lundgren') {
                    return done(null, profile);
                } else {
                    console.log('Invalid user: ' + profile.displayName);
                    return done(null, false, 'Invalid user');
                }

            });
        }
    ));

    // serialize and deserialize
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });

};