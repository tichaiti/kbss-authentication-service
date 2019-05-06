const { Strategy } = require('passport-local');
const { isEmpty } = require('lodash');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const options = {
    usernameField: 'email',
};

const SigninStrategy = new Strategy(options, (email, password, done) => {
    User.findOne({ email }).lean().exec((err, user) => {
        if (err) {
            return done(err, null);
        }
        if (isEmpty(user)) {
            return done('No user found', null);
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password); // true

        if (!isPasswordValid) {
            return done('Email or Password invalid', null);
        }

        return done(null, user);
    });
});

module.exports = SigninStrategy;
