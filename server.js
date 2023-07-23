const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const colors = require('colors');

// local files
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const {protect} = require("./middleware/auth");

// load env vars
dotenv.config({ path: './config/.env' });

// database connection
connectDB();

const port = process.env.PORT || 5000;
const app = express();

// use morgan in dev mode
if (process.env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// routers
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/products', protect, require('./routes/products'));
app.use('/api/v1/leads', protect, require('./routes/leads'));
app.use('/api/v1/records', protect, require('./routes/records'));
app.use('/api/v1/sales', protect, require('./routes/sales'));

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(
    `Server is running
  in: ${process.env.nodeEnv} mode
  on: http://localhost${port}/api/v1`.cyan.bold
  );
});

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});
