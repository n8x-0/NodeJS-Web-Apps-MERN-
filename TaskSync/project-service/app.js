require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const projectRoutes = require('./routes/project.routes')
const issuesRoutes = require('./routes/issues.routes')
const connectToDatabase = require('./db/connection');
const { globalErrorHandler } = require('./middlewares/global-error-handler');
const { isLoggedIn } = require('./middlewares/auth-middleware');

connectToDatabase()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('DB Connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'))

// TODO : apply loggedin middleware

app.use("/", isLoggedIn,projectRoutes)
app.use("/issue", issuesRoutes)

app.use(globalErrorHandler)
module.exports = app