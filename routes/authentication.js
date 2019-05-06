const express = require('express');
const passport = require('../passport');

const router = express.Router();

router.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
});


router.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (error, user) => {
        const statusCode = typeof err === 'string' ? 400 : 500;
        const errorMessage = typeof err === 'string' ? error : error.message || 'Internal server error';
        if (error) {
            return res.status(statusCode).json({
                error: errorMessage,
            });
        }
        return req.login(user, (err) => {
            if (err) {
                return res.status(statusCode).json({
                    error: errorMessage,
                });
            }

            return res.json({
                isAuthenticated: true,
            });
        });
    })(req, res, next);
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local-signin', (error, user) => {
        if (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json(error);
        }
        return req.login(user, (err) => {
            if (err) {
                const statusCode = error.statusCode || 500;
                return res.status(statusCode).json(err);
            }

            return res.json({
                isAuthenticated: true,
            });
        });
    })(req, res, next);
});

module.exports = router;
