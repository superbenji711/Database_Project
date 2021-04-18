const sectorController = require('../controllers/sectorController');
const express = require('express');
const stockRouter = express.Router();

stockRouter.get('/data/:id/:startMonth/:startYear/:endMonth/:endYear', sectorController.getOne)


module.exports = stockRouter;