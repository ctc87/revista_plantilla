(function(Interfacelogin){
    Interfacelogin.passport = require('passport');
    var Auth0Strategy = require('passport-auth0');
    var dotenv = require('dotenv');

    dotenv.load();
    // Configure Passport to use Auth0
    var strategy = new Auth0Strategy({
        domain:       process.env.AUTH0_DOMAIN,
        clientID:     process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL:  process.env.AUTH0_CALLBACK_URL || 'http://localhost:8081/callback'
      }, function(accessToken, refreshToken, extraParams, profile, done) {
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
        return done(null, profile);
      });
      Interfacelogin.passport.use(strategy);

    // This can be used to keep a smaller payload
    Interfacelogin.passport.serializeUser(function(user, done) {
      done(null, user);
    });
    
    Interfacelogin.passport.deserializeUser(function(user, done) {
      done(null, user);
    });

    return Interfacelogin;
})(typeof exports === "undefined" ? Interfacelogin = {} : exports);
