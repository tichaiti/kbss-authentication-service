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
            return done({ statusCode: 500, ...err }, null);
        }
        if (!isEmpty(user)) {
            return done({ statusCode: 400, message: 'User already exist' }, null);
        }

        const encryptedPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({
            ...req.body,
            email,
            password: encryptedPassword,
        });

        return newUser.save((error, inserted) => {
            if (error) {
                const statusCode = error.name === 'ValidationError' ? 400 : 500;
                return done({ statusCode, ...error }, null);
            }
            const userData = inserted.toObject();
            delete userData.password;
            return done(null, userData);
        });
    });
});

module.exports = SignupStrategy;
