const cpiController = require('../controllers/cpiController');
// const express = require() 'express';
const express = require('express');

const cpiRouter = express.Router();


cpiRouter.get('/', cpiController.getAll); //get all

module.exports = cpiRouter;