
const responseHelper = {
  userNotFount: { message: 'User not found', key: 'userNotFound'},
  invalidToken: { message: 'Invalid Token', key: 'invalidToken'},
  tokenExpired: { message: 'Token expired', key: 'tokenExpired'},
  wrongCreds: {message: "Email or Password is wrong!", key: 'wrongCreds'}
}


module.exports = responseHelper;