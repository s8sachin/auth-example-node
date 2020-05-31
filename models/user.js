const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    default: null
  },
  type: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'superAdmin'],
  },
}, {
  timestamps: true,
});

UserSchema.pre('save', (next) => {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.isValidPassword = async (password) => {
  const user = this;
  // Hashes the password sent by the user for login and checks if the hashed password stored in the
  // database matches the one sent. Returns true if it does else false.
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

module.exports = mongoose.model('User', UserSchema);