const express = require('express');
const passport = require('passport');
const router = express.Router();
const UsersController = require('../controllers/users');

const jwtAuth = passport.authenticate('jwt', { session : false });

router.post('/signUp', UsersController.signUp);
router.post('/login', UsersController.login);
router.get('/profile', jwtAuth, UsersController.getProfile);

module.exports = router;
