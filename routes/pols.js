const express = require('express');
let pols = express.Router();

pols.post('/', (req, res) => {
    res.send('this is the POST /pols route!');
});

pols.get('/:pol_id', (req, res) => {
    res.send('this is the GET /pols/:pol_id route!');
});

pols.get('/', (req, res) => {
    res.send('this is the GET /pols route!');
});

pols.put('/:pol_id', (req, res) => {
    res.send('this is the PUT /pols/:pol_id route!');
});

pols.patch('/:pol_id', (req, res) => {
    res.send('this is the PATCH /pols/:pol_id route!');
});

pols.delete('/:pol_id', (req, res) => {
    res.send('this is the DELETE /pols/:pol_id route!');
});

module.exports = pols;