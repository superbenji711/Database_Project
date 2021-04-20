const sectorController = require('../controllers/sectorController');
const express = require('express');
const stockRouter = express.Router();

stockRouter.get('/data/:id/:startMonth/:startYear/:endMonth/:endYear', sectorController.getOne)
stockRouter.get('/correlatedPeaks/:symbol', sectorController.correlatedPeaks)
stockRouter.get('/correlatedFalls/:symbol', sectorController.correlatedFalls)
stockRouter.get('/data/:symbol', sectorController.getValue)

module.exports = stockRouter;