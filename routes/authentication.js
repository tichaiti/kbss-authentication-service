const express = require('express');
const passport = require('../passport');

const router = express.Router();

router.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.json({
        isAuthenticated: false,
    });
});


router.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (error, user) => {
        if (error) {
            return res.status(error.statusCode).json({
                message: error.message || 'Internal server error',
            });
        }
        return req.login(user, (err) => {
            if (err) {
                return res.status(err.statusCode).json({
                    message: err.message,
                });
            }

            return res.json({
                isAuthenticated: true,
                user,
            });
        });
    })(req, res, next);
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local-signin', (error, user) => {
        if (error) {
            return res.status(error.statusCode).json({
                message: error.message || 'Internal server error',
            });
        }
        return req.login(user, (err) => {
            if (err) {
                return res.status(err.statusCode).json({
                    message: err.message || 'Internal server error',
                });
            }

            return res.json({
                isAuthenticated: true,
                user,
            });
        });
    })(req, res, next);
});

module.exports = router;
