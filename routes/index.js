var express = require('express');
var router = express.Router();
const {Datastore} = require('@google-cloud/datastore');
const { get_users } = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.oidc.isAuthenticated()){
    let redirectUrl = req.protocol + '://' + req.get('host') + req.baseUrl + '/users/' + req.oidc.user.sub;
    res.redirect(redirectUrl);
  } else {
    res.render('index', { title: 'Express' });
  }
});

router.get('/users', get_users, (req, res) => {
  res.locals.users_res = res.locals.users.map((user) => {
    const name = user[Datastore.KEY].name;
    const username = user.username;
    const teams = user.teams;
    const self = req.protocol + "://" + req.get('host') + req.baseUrl + '/users/' + name;
    return {name, username, teams, self};
  });
  res.status(200).json(res.locals.users_res);
})

module.exports = router;
