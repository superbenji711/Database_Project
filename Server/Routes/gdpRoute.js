const gdpController = require('../controllers/gdpController');
// const express = require() 'express';
const express = require('express');

const gdpRouter = express.Router();


gdpRouter.get('/', gdpController.getAll); //get all

module.exports = gdpRouter;