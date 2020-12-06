const express = require('express');
const { post_pol, get_a_pol, get_pols, put_a_pol, patch_a_pol, delete_pol, edit_a_pol } = require('../models/pols');
const { put_a_team } = require('../models/teams');
let pols = express.Router();

pols.post('/', post_pol, get_a_pol, (req, res) => {
    res.status(201).json(res.locals.pol);
});

pols.get('/:pol_id', get_a_pol, (req, res) => {
    res.status(200).json(res.locals.pol);
});

pols.get('/', get_pols, (req, res) => {
    res.status(200).json(res.locals.pols);
});

pols.put('/:pol_id', get_a_pol, edit_a_pol, (req, res) => {
    res.status(200).json(res.locals.edited_pol);
});

pols.patch('/:pol_id', get_a_pol, edit_a_pol, (req, res) => {
    res.status(200).json(res.locals.edited_pol);
});

pols.delete('/:pol_id', delete_pol, (req, res) => {
    res.send('this is the DELETE /pols/:pol_id route!');
});

module.exports = pols;