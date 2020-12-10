var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const {Datastore} = require('@google-cloud/datastore');
const { get_users, build_users } = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.oidc.isAuthenticated()){
    let redirectUrl = req.protocol + '://' + req.get('host') + req.baseUrl + '/users/' + req.oidc.user.sub;
    res.redirect(redirectUrl);
  } else {
    res.render('index', { title: 'Fantasy Cabinet API' });
  }
});

router.get('/users', get_users, build_users, (req, res) => {
  res.status(200).json(res.locals.users_res);
})

router.delete('/users', (req, res, next) => {
  var error = new createError.MethodNotAllowed('You can not use this method on this route');
  next(error);
});

router.put('/users', (req, res, next) => {
  var error = new createError.MethodNotAllowed('You can not use this method on this route');
  next(error);
});



module.exports = router;
