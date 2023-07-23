const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');

// @desc     Register user
// @route    POST -> "/api/v1/auth/register"
// @access   Public
exports.register = asyncHandler(async (req, res, next) => {
  const {name, email, password} = req.body;
  const hash = await bcrypt.hash(password, 10);
  if(!hash) return next(new ErrorResponse(`Check again your password`, 400));
  const user = await User.create({name, email, password: hash});
  const payload = {id: user.id};
  const options = {expiresIn: 360000} 
  const token = jwt.sign(payload, process.env.jwtSecret, options);
  if(!token) return next(new ErrorResponse(`Server Error`, 500));
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true
  }
  if(process.env.nodeEnv === 'production') {
    cookieOptions.secure = true;
  };
  res.status(200).cookie('token', token, cookieOptions).json({success: true, token});
});

// @desc     Login user
// @route    POST -> "/api/v1/auth/login"
// @access   Public
exports.login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;
  if(!email || !password) return next(new ErrorResponse(`Please provide an email and password`, 400));
  const user = await User.findOne({email}).select('+password');
  if(!user) return next(new ErrorResponse(`Try again`, 400));
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) return next(new ErrorResponse(`Try again`, 400));
  const payload = {id: user.id};
  const options = {expiresIn: 360000} 
  const token = jwt.sign(payload, process.env.jwtSecret, options);
  if(!token) return next(new ErrorResponse(`Server Error`, 500));
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if(process.env.nodeEnv === 'production') {
    cookieOptions.secure = true;
  };
  res.status(200).cookie('token', token, cookieOptions).json({success: true, token});
});

// @desc     Logout user
// @route    POST -> "/api/v1/auth/me"
// @access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.json({success: true, data: user});
});

// @desc     Logout user
// @route    POST -> "/api/v1/auth/logout"
// @access   Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.json({msg: "Logout user"});
});