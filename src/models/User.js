const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});
// Using keyword function instead of arrow function for 'this' inside of the function scope
// instead of the 'this' from arrow functions which will be the context of the file
userSchema.pre('save', function(next) {
  const  user = this;
  if(!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (error, salt) => {
    if (error) {
      return next(error);
    }

    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) {
        return next(error);
      }
      user.password = hash;
      next();
    });
  })
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
      if (error) {
        return reject(error);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
}

mongoose.model('User', userSchema);