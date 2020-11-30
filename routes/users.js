const express = require('express');
let users = express.Router();
const axios = require('axios');
const teams = require('./teams');
const { post_user, new_user_check, get_a_user, build_a_user, check_jwt } = require('../models/users');
users.use(check_jwt);
users.use('/teams', teams);

users.get('/', new_user_check, post_user, async (req, res, next) => {
  res.send(`hello ${req.oidc.user.name}, sub: ${req.oidc.user.sub}
    ${req.oidc.idToken}`);
});

users.post('/', post_user, build_a_user, (req, res) => {
  console.log(res.locals.newUser);
});

module.exports = users;