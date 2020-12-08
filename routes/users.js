const express = require('express');
let users = express.Router();
const axios = require('axios');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const { requiresAuth } = require('express-openid-connect');
const teams = require('./teams');
const { post_user, new_user_check, get_a_user, build_a_user, is_user_route, save_user_id } = require('../models/users');
const { check_sub } = require('../helpers/errors');


check_jwt_sign_in = jwt({
  secret: jwks.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://dev-gkmox8gz.us.auth0.com/.well-known/jwks.json`
  }),
  getToken: function fromReq(req) {
    return req.oidc.idToken;
  },
  issuer: 'https://dev-gkmox8gz.us.auth0.com/',
  algorithms: [ 'RS256' ]
});

check_jwt_else = jwt({
  secret: jwks.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://dev-gkmox8gz.us.auth0.com/.well-known/jwks.json`
  }),
  issuer: 'https://dev-gkmox8gz.us.auth0.com/',
  algorithms: [ 'RS256' ]
});

users.use('/teams', check_jwt_else, teams);
users.get('/', is_user_route, requiresAuth(), new_user_check, post_user, async (req, res, next) => {
  console.log(req.user);
  console.log('-------------------------------');
  console.log(req.oidc.user);
  console.log('-------------------------------');
  console.log(req.oidc);
  console.log('-------------------------------');
  res.render('userinfo', {
    username: req.oidc.user.name, 
    sub: req.oidc.user.sub, 
    jwt: req.oidc.idToken
  });
  // res.send(`hello ${req.oidc.user.name}, sub: ${req.oidc.user.sub}
  //   ${req.oidc.idToken}`);
});

users.post('/', post_user, build_a_user, (req, res) => {
  console.log(res.locals.newUser);
});

module.exports = users;