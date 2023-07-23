const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name'],
    },
    email: {
      type: String,
      required: [true, 'Email is requird'],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is requird'],
      minlength: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
