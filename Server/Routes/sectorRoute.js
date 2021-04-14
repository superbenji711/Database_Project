const sectorController = require('../controllers/sectorController');
const express = require('express');
const sectorRouter = express.Router();

sectorRouter.get('/', sectorController.getAll); //get all
<<<<<<< HEAD
=======
// sectorRouter.get('/:_id', userController.get); get through id


// sectorRouter.put('/:_id', userController.update); //update by id
>>>>>>> d8a063920331cd9a3ad81fd693061b9258b835af


module.exports = sectorRouter;