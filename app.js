var createError = require('http-errors');
const { auth, requiresAuth } = require('express-openid-connect');
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
      baseURL: process.env.BASE_URL,
      clientID: process.env.CLIENT_ID,
      secret: process.env.SECRET   })
);

app.use('/', indexRouter);
app.use('/users/:user_id', requiresAuth(), usersRouter);
app.use('/pols', polsRouter);
app.use('/insts', instsRouter);

app.get('/login',(req, res) => {
  
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  if (err.name === 'UnauthorizedError' && req.method === 'GET') {
    res.locals.isOwner = false;
    next();
  } else if (err.name === 'UnauthorizedError') {
    res.status(401).send({'Error' : 'invalid token...'});
  } else {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
