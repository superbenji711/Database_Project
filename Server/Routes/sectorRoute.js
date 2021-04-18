const sectorController = require('../controllers/sectorController');
const express = require('express');
const sectorRouter = express.Router();

sectorRouter.get('/', sectorController.getAll); //get all
sectorRouter.get('/performance/:dateData', sectorController.getPerformance);
sectorRouter.get('/:id/:startMonth/:startYear/:endMonth/:endYear', sectorController.getOne)


module.exports = sectorRouter;