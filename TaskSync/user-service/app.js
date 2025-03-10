require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rabbitMq = require("./service/rabbit")
//middlewares
const connectToDatabase = require('./db/connection');
const {globalErrorHandler} = require("./middlewares/global-error-handler");
const { isLoggedIn } = require('./middlewares/auth-middleware');

//controllers
const userRoutes = require("./routes/user.routes");

// rabbitMq.connect()

connectToDatabase().catch((err) => console.error('DB Connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'))

//routes
app.use("/", isLoggedIn, userRoutes)

app.use(globalErrorHandler)

module.exports = app