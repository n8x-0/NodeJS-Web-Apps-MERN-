require('dotenv').config();
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectToDatabase = require('./db/connection');
const { globalErrorHandler } = require('./middlewares/global-error-handler');
const rabbitMq = require("./service/rabbit")
const userRoutes = require('./routes/user.routes')

rabbitMq.connect()
connectToDatabase()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('DB Connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'))

app.use("/", userRoutes)

app.use(globalErrorHandler)
module.exports = app