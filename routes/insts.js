const express = require('express');
const { post_inst, get_an_inst, get_insts, edit_an_inst, delete_inst } = require('../models/insts');
let insts = express.Router();

insts.post('/', post_inst, get_an_inst, (req, res) => {
    res.status(201).json(res.locals.inst);
});

insts.get('/:inst_id', get_an_inst, (req, res) => {
    res.status(200).json(res.locals.inst);
});

insts.get('/', get_insts, (req, res) => {
    res.status(200).json(res.locals.insts);
});

insts.put('/:inst_id', get_an_inst, edit_an_inst, (req, res) => {
    res.status(200).json(res.locals.edited_inst);
});

insts.patch('/:inst_id', get_an_inst, edit_an_inst, (req, res) => {
    res.status(200).json(res.locals.edited_inst);
});

insts.delete('/:inst_id', (req, res) => {
    res.send('this is the DELETE /insts/:inst_id route!');
});

module.exports = insts;