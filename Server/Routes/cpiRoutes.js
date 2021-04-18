const cpiController = require('../controllers/cpiController');
// const express = require() 'express';
const express = require('express');

const cpiRouter = express.Router();


cpiRouter.get('/:symbol', cpiController.getCorrelation); //get correlations

module.exports = cpiRouter;