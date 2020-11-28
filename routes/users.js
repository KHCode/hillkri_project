const express = require('express');
let users = express.Router();
const teams = require('./teams');

users.use('/teams', teams);

module.exports = users;