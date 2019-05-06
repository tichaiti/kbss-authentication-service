const mongoose = require('mongoose');

const { Schema } = mongoose;

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const validateEmail = email => emailRegex.test(email);

const UserSchema = new Schema({
    profileId: String,
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [emailRegex, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        minlength: [8, 'Password too short'],
        select: false,
    },
    username: String,
    profileImage: String,
    accessToken: String,
    refreshToken: String,
    provider: {
        type: String,
        default: 'local',
    },
    userGroups: [
        { type: String, default: 'everyone' },
    ],
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
