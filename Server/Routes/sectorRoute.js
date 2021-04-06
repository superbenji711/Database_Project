const sectorController = require('../controllers/sectorController');
// const express = require() 'express';
const express = require('express');

const sectorRouter = express.Router();



sectorRouter.get('/', sectorController.getAll); //get all
// sectorRouter.get('/:_id', userController.get); get through id



// sectorRouter.put('/:_id', userController.update); //update by id


module.exports = sectorRouter;