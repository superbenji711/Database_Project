const sectorController = require('../controllers/sectorController');
const express = require('express');
const sectorRouter = express.Router();

sectorRouter.get('/', sectorController.getAll); //get all


module.exports = sectorRouter;