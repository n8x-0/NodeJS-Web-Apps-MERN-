require('dotenv').config();
const express = require('express');
const app = express();
const expressProxy = require('express-http-proxy');
const morgan = require('morgan');

app.use(morgan("dev"))

app.use('/auth', expressProxy(process.env.AUTH_SERVICE_PATH));
app.use('/user', expressProxy(process.env.USER_SERVICE_PATH));
app.use('/projects', expressProxy(process.env.PROJECT_SERVICE_PATH));

module.exports = app;
