const cpiController = require('../controllers/cpiController');
// const express = require() 'express';
const express = require('express');

const cpiRouter = express.Router();

// cpiController.getAll();

cpiRouter.get('/', cpiController.getAll); //get all
// cpiRouter.get('/:_id', cpiController.getAll); //get all get through id



// sectorRouter.put('/:_id', userController.update); //update by id


module.exports = cpiRouter;