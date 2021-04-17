const sectorController = require('../controllers/sectorController');
const express = require('express');
const sectorRouter = express.Router();

sectorRouter.get('/', sectorController.getAll); //get all
sectorRouter.get('/:symbol', sectorController.get); //get 

module.exports = sectorRouter;