const express = require('express');
const User = require('../models/user');

const router = express.Router();

function checkAuthentication(req, res, next) {
    const isAuthenticate = req.isAuthenticated();
    if (isAuthenticate) {
        return next();
    }

    return res.status(401).json({
        message: 'Not authorized',
        statusCode: 401,
    });
}

router.get('/user', checkAuthentication, (req, res) => {
    User.findOne({ _id: req.user._id }, (error, user) => {
        if (error) {
            return res.status(500).json({
                message: error.message || 'Internal Error',
                statusCode: 500,
            });
        }

        return res.status(200).json({
            statusCode: 200,
            user,
        });
    });
});


module.exports = router;
