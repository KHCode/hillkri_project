var express = require('express');
var router = express.Router();
const {Datastore} = require('@google-cloud/datastore');
const { get_users, build_users } = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.oidc.isAuthenticated()){
    let redirectUrl = req.protocol + '://' + req.get('host') + req.baseUrl + '/users/' + req.oidc.user.sub;
    res.redirect(redirectUrl);
  } else {
    res.render('index', { title: 'Express' });
  }
});

router.get('/users', get_users, build_users, (req, res) => {
  res.status(200).json(res.locals.users_res);
})

module.exports = router;
