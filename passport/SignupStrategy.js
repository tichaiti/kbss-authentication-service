const { Strategy } = require('passport-local');
const { isEmpty } = require('lodash');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const salt = bcrypt.genSaltSync(10);

const options = {
    passReqToCallback: true,
    usernameField: 'email',
};

const SignupStrategy = new Strategy(options, (req, email, password, done) => {
    User.findOne({ email }).lean().exec((err, user) => {
        if (err) {
            return done(err, null);
        }
        if (!isEmpty(user)) {
            return done('User already exist', null);
        }

        const encryptedPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({
            ...req.body,
            email,
            password: encryptedPassword,
        });

        return newUser.save((error, inserted) => {
            if (error) {
                return done(error, null);
            }
            return done(null, inserted);
        });
    });
});

module.exports = SignupStrategy;
