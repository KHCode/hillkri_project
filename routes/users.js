const express = require('express');
let users = express.Router();
const teams = require('./teams');
const { post_user, new_user_check } = require('../models/users');

users.use('/teams', teams);

users.get('/', new_user_check, (req, res) => {
  if(res.locals.isNewUser){
    post_user;
  }
  res.send(`hello ${req.oidc.user.nickname}, sub: ${req.oidc.user.sub}
              ${req.oidc.idToken}`);
});

module.exports = users;