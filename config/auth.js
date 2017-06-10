
var callbackURL = '';
if ('prod' == process.env.ENV) {
    callbackURL = 'https://disconnect.cfapps.io/auth/facebook/callback';
} else {
    callbackURL = 'http://localhost:3000/auth/facebook/callback';
}
module.exports = {
    'facebookAuth' : {
        'clientID'          : process.env.CLIENTID,
        'clientSecret'      : process.env.CLIENTSECRET,
        'callbackURL'       : callbackURL
    }
};