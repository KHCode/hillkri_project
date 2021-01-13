var createError = require('http-errors');
const { auth } = require('express-openid-connect');
require('dotenv').config();
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var polsRouter = require('./routes/pols');
var instsRouter = require('./routes/insts');
const { save_user_id } = require('./models/users');
const { has_required_params } = require('./helpers/errors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('trust proxy', true);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: false,
      secure: false,
      httpOnly: true,
    }
  })
)

app.use(
  auth({
      authRequired: false,
      auth0Logout: true,
      issuerBaseURL: process.env.ISSUER_BASE_URL,
      baseURL: 'http://localhost:3000',
      clientID: process.env.CLIENT_ID,
      secret: process.env.SECRET   })
);

app.use('/', indexRouter);
app.use('/users/:user_id', save_user_id, usersRouter);
app.use('/pols', polsRouter);
app.use('/insts', instsRouter);

app.get('/login',(req, res) => {
  
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var error = new createError.NotFound('Could not find that resource');
  next(error);
});

// // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.name);
  console.log(typeof err.name);
  console.log(err.status);

  if (err.name == 'UnauthorizedError') {                  //401
    if (res.locals.isUserRoute) {
      res.redirect('/');
    } else {
      res.status(401).json({Error: 'Invalid token'});
    }
  } else if (err.name == 'BadRequestError') {             //403
    res.status(err.status).json({Error: err.message});
  } else if (err.name == 'ForbiddenError') {              //403
    res.status(err.status).json({Error: err.message});
  } else if (err.name == 'NotFound') {                    //404
    res.status(err.status).json({Error: err.message});
  } else if (err.name == 'MethodNotAllowedError') {       //405
    res.status(err.status).json({Error: err.message});
  } else if (err.name == 'NotAcceptableError') {          //406
    res.status(err.status).json({Error: err.message});
  } else if (err.name == 'UnsupportedMediaTypeError') {   //415
    res.status(err.status).json({Error: err.message});
  } else {
    console.error(err.stack)
    res.status(500).send('Something broke!');
  }

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
