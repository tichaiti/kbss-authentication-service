require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const cors = require('cors');
const passport = require('./passport');
const authenticationRoute = require('./routes/authentication');
const apiRoutes = require('./routes/apiRoutes');

const { log } = console;
const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/kbss');

app.use(express.urlencoded({
    extended: false,
}));
app.use(express.json());
app.use(cors());
app.use(cookieSession({
    maxAge: process.env.MAX_AGE || 24 * 60 * 60 * 1000, // one day in miliseconds
    name: 'session',
    keys: [
        process.env.KEY_ONE || 'key1',
        process.env.KEY_TWO || 'key2',
    ],
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/authentication', authenticationRoute);
app.use('/api', apiRoutes);

app.listen(PORT, () => log('Server is starting ', PORT));
