const express = require('express');
const { post_team, get_a_team, get_teams, put_a_team, patch_a_team, delete_team, edit_a_team } = require('../models/teams');
let teams = express.Router();

teams.post('/', post_team, get_a_team, (req, res) => {
    res.status(201).json(res.locals.team);
});

teams.get('/:team_id', get_a_team, (req, res) => {
    res.status(200).json(res.locals.team);
});

teams.get('/', get_teams, (req, res) => {
    res.status(200).json(res.locals.teams);
});

teams.put('/:team_id', get_a_team, edit_a_team, (req, res) => {
    res.status(200).json(res.locals.edited_team);
});

teams.patch('/:team_id', get_a_team, edit_a_team, (req, res) => {
    res.status(200).json(res.locals.edited_team);
});

teams.delete('/:team_id', delete_team, (req, res) => {
    res.send('this is the DELETE /users/:user_id/teams/:team_id route!');
});

module.exports = teams;