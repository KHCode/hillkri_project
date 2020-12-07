const express = require('express');
var createError = require('http-errors');
const { post_inst, get_an_inst, get_insts, edit_an_inst, delete_inst, join_pol_inst, remove_pol_from_an_inst } = require('../models/insts');
const { get_a_pol, edit_a_pol, get_pols, remove_inst_from_pols, remove_inst_from_a_pol } = require('../models/pols');
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

insts.delete('/:inst_id', get_pols, remove_inst_from_pols, delete_inst, (req, res) => {
    res.status(204).end();
});

insts.post('/:inst_id/pols/:pol_id', get_an_inst, get_a_pol, join_pol_inst, edit_an_inst, edit_a_pol, (req, res, next) => {
    res.status(201).json(res.locals.edited_inst);
});

insts.delete('/:inst_id/pols/:pol_id', get_an_inst, remove_pol_from_an_inst, get_a_pol, remove_inst_from_a_pol, (req, res, next) => {
    res.status(204).end();
});

insts.delete('/', (req, res, next) => {
    var error = new createError.MethodNotAllowed('You can not use delete at a collections level');
    next(error);
});

insts.put('/', (req, res, next) => {
    var error = new createError.MethodNotAllowed('You can not use put at a collections level');
    next(error);
});

module.exports = insts;