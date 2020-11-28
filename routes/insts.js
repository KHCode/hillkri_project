const express = require('express');
let insts = express.Router();

insts.post('/', (req, res) => {
    res.send('this is the POST /insts route!');
});

insts.get('/:inst_id', (req, res) => {
    res.send('this is the GET /insts/:inst_id route!');
});

insts.get('/', (req, res) => {
    res.send('this is the GET /insts route!');
});

insts.put('/:inst_id', (req, res) => {
    res.send('this is the PUT /insts/:inst_id route!');
});

insts.patch('/:inst_id', (req, res) => {
    res.send('this is the PATCH /insts/:inst_id route!');
});

insts.delete('/:inst_id', (req, res) => {
    res.send('this is the DELETE /insts/:inst_id route!');
});

module.exports = insts;