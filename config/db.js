const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.mongoUri);
  console.log(`MongoDB Connected`.yellow.bold);
};

module.exports = connectDB;
