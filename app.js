const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
/** Connect to db  */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('connection succesful');
})
.catch((err) => console.error(err));
mongoose.set('debug', true);

require('./config/passport');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

/** catch 404 and forward to error handler*/
app.use((req, res, next) => {
  res.status(404).json({message: 'Route not found'});
});

/** Error handler */
app.use((err, req, res, next) => {
  console.log(err);
  if (process.env.NODE_ENV !== "production") {
      res.status(500).json(err)
  } else {
      res.status(500).json(err)
  }
});

module.exports = app;
