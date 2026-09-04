const express = require('express');

const app = express();
const mongoose = require('mongoose');

require('dotenv').config();

const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

app.set('view engine', 'ejs');
mongoose.connect(process.env.MONGO_URI);


app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refresgToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));




app.listen(process.env.PORT || 3000, () => {
    console.log(`server is now running on port ${process.env.PORT}`)
})