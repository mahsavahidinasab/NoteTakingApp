require('dotenv').config();


const dns = require("dns");
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');

const session = require('express-session');
const mongoose = require('mongoose');
const {MongoStore} = require('connect-mongo');
const passport = require('passport');
const path = require('path');
const methodOverride = require('method-override');
const configurePassport = require('./config/passport');

const app = express();

const port = process.env.PORT || 3000;
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// =======================
// Session configuration
// =======================

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
);

// =======================
// Passport configuration
// =======================


configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// make logged in users available to ejs

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// ===============
// routes
// ===============

app.use(require('./routes/pageRoutes'));
app.use(require('./routes/auth'));
app.use(require('./routes/noteRoutes'))

// ===================
//  start server
//  ==================

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exitCode = 1;
  }
}

startServer();
