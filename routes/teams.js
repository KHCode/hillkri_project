const express = require('express');
const { post_team, get_a_team, get_teams, put_a_team, patch_a_team, delete_team } = require('../models/teams');
let teams = express.Router();

teams.post('/', post_team, get_a_team, (req, res) => {
    res.status(204).json(res.locals.team);
});

teams.get('/:team_id', get_a_team, (req, res) => {
    res.send('this is the GET /users/:user_id/teams/:team_id route!');
});

teams.get('/', get_teams, (req, res) => {
    res.send('this is the GET /users/:user_id/teams route!');
});

teams.put('/:team_id', put_a_team, (req, res) => {
    res.send('this is the PUT /users/:user_id/teams/:team_id route!');
});

teams.patch('/:team_id', patch_a_team, (req, res) => {
    res.send('this is the PATCH /users/:user_id/teams/:team_id route!');
});

teams.delete('/:team_id', delete_team, (req, res) => {
    res.send('this is the DELETE /users/:user_id/teams/:team_id route!');
});

module.exports = teams;