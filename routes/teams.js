const express = require('express');
let teams = express.Router();

teams.post('/', (req, res) => {
    res.send('this is the POST users/:user_id/teams route!');
});

teams.get('/:team_id', (req, res) => {
    res.send('this is the GET /users/:user_id/teams/:team_id route!');
});

teams.get('/', (req, res) => {
    res.send('this is the GET /users/:user_id/teams route!');
});

teams.put('/:team_id', (req, res) => {
    res.send('this is the PUT /users/:user_id/teams/:team_id route!');
});

teams.patch('/:team_id', (req, res) => {
    res.send('this is the PATCH /users/:user_id/teams/:team_id route!');
});

teams.delete('/:team_id', (req, res) => {
    res.send('this is the DELETE /users/:user_id/teams/:team_id route!');
});

module.exports = teams;