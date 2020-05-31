const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const { Strategy: JWTstrategy, ExtractJwt } = require('passport-jwt');

const UserModel = require('../models/user');
const responseHelper = require('../utils/responseHelper');
const { JWT_SECRET } = process.env;

// Create a passport middleware to handle user registration
// passport.use('signup', new localStrategy({
//   usernameField : 'email',
//   passwordField : 'password'
// }, async (email, password, done) => {
//   try {
//     //Save the information provided by the user to the the database
//     const user = await UserModel.create({ email, password });
//     //Send the user information to the next middleware
//     return done(null, user);
//   } catch (error) {
//     done(error);
//   }
// }));

// Passport middleware to handle User login
passport.use('login', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email });
    if( !user ){
      return done(null, false, { message : 'User not found', status: 404 });
    }
    
    const validate = await user.isValidPassword(password);
    if( !validate ){
      return done(null, false, { ...responseHelper.wrongCreds, status: 403 });
    }
    return done(null, user, { message : 'Logged in Successfully', status: 200 });
  } catch (error) {
    return done(error);
  }
}));

// This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  secretOrKey : JWT_SECRET,
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));

