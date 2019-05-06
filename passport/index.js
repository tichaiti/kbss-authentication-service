const passport = require('passport');
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }).lean().exec((error, user) => {
        if (error) {
            return done(error, null);
        }
        return done(null, user);
    });
});

// Import all our strategies
const SigninStrategy = require('./SigninStrategy');
const SignupStrategy = require('./SignupStrategy');


// Configure our strategies
passport.use('local-signin', SigninStrategy);
passport.use('local-signup', SignupStrategy);

module.exports = passport;
