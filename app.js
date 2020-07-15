const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwtAuth = require('./lib/jwtAuth');

require('dotenv').config();
require('./lib/connectMongoose');

const app = express();

/* Allow all cors request */
app.use(cors({ credentials: true, origin: 'http://localhost:3001' }));

/* Fix email issue with TLS Request, FIXED IN EMAIL REQUEST */
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/currentuser', require('./routes/api/currentUser'));
app.use('/api/recoverpassword', require('./routes/api/recoverPassword'));
app.use('/api/adverts', require('./routes/api/adverts'));
app.use('/api/status', jwtAuth(), require('./routes/api/reserved-sold'));
app.use('/api/favorites', jwtAuth(), require('./routes/api/favorites'));
app.use('/api/tags', require('./routes/api/tags'));
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
