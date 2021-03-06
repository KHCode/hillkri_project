const express = require('express');
var createError = require('http-errors');
const { get_a_pol, edit_a_pol } = require('../models/pols');
const { post_team, get_a_team, get_teams, remove_pol_from_a_team, delete_team, edit_a_team, join_pol_team } = require('../models/teams');
const { check_sub, check_accepts } = require('../helpers/errors');
let teams = express.Router();

teams.post('/', check_accepts, post_team, get_a_team, (req, res) => {
    console.log("---------------------------");
    console.log(req.user);
    console.log("---------------------------");
    console.log(req.get('Authorization'));
    console.log("---------------------------");
    res.status(201).json(res.locals.team);
});

teams.get('/:team_id', check_accepts, get_a_team, check_sub, (req, res) => {
    res.status(200).json(res.locals.team);
});

teams.get('/', check_accepts, get_teams, (req, res) => {
    res.status(200).json(res.locals.teams);
});

teams.put('/:team_id', check_accepts, get_a_team, check_sub, edit_a_team, (req, res) => {
    res.status(200).json(res.locals.edited_team);
});

teams.patch('/:team_id', check_accepts, get_a_team, check_sub, edit_a_team, (req, res) => {
    res.status(200).json(res.locals.edited_team);
});

teams.delete('/:team_id', get_a_team, check_sub, delete_team, (req, res) => {
    res.status(204).end();
});

teams.post('/:team_id/pols/:pol_id', check_accepts, get_a_team, check_sub, get_a_pol, join_pol_team, edit_a_team, (req, res, next) => {
    res.status(201).json(res.locals.edited_team);
});

teams.delete('/:team_id/pols/:pol_id', get_a_team, check_sub, remove_pol_from_a_team, (req, res, next) => {
    res.status(204).end();
});

teams.delete('/', (req, res, next) => {
    var error = new createError.MethodNotAllowed('You can not use this method on this route');
    next(error);
});

teams.put('/', (req, res, next) => {
    var error = new createError.MethodNotAllowed('You can not use this method on this route');
    next(error);
});

module.exports = teams;