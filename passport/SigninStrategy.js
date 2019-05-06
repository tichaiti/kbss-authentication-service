const { Strategy } = require('passport-local');
const { isEmpty } = require('lodash');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const options = {
    usernameField: 'email',
};

const SigninStrategy = new Strategy(options, (email, password, done) => {
    User.findOne({ email })
        .select('+password')
        .lean()
        .exec((err, user) => {
            if (err) {
                return done({ statusCode: 500, ...err }, null);
            }
            if (isEmpty(user)) {
                return done({ statusCode: 400, message: 'No user found' }, null);
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password); // true

            if (!isPasswordValid) {
                return done({ statusCode: 400, message: 'Email or Password invalid' }, null);
            }
            const userData = user;
            delete userData.password; // delete user password so it doesn't make it to the client
            return done(null, userData);
    });
});

module.exports = SigninStrategy;
