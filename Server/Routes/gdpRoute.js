const gdpController = require('../controllers/gdpController');
// const express = require() 'express';
const express = require('express');

const gdpRouter = express.Router();


gdpRouter.get('/count', gdpController.getCount);
gdpRouter.get('/:id', gdpController.getGDPStockData); 
gdpRouter.get('/corr/:id', gdpController.getGDPCorrelation);
gdpRouter.get('/', gdpController.getAll); //get all

module.exports = gdpRouter;