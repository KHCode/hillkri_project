const express = require('express');
let users = express.Router();
const axios = require('axios');
const teams = require('./teams');
const { post_user, new_user_check, get_a_user, build_user } = require('../models/users');
const { MaxRedirectsError } = require('got/dist/source');

users.use('/teams', teams);

users.get('/', new_user_check, async (req, res, next) => {
  console.log(res.locals.isNewUser);
  
  if(res.locals.isNewUser){
    axios({
      method: 'post',
      url: '/',
      data: {
        name: req.oidc.user.sub,
        username: req.oidc.user.name,
      }
    });
    // post_user(req, res, next);
 } 
  res.send(`hello ${req.oidc.user.name}, sub: ${req.oidc.user.sub}
    ${req.oidc.idToken}`);
});

users.post('/', post_user, build_user, (req, res) => {
  res.status(204).json(res.locals.newUser);
});

module.exports = users;