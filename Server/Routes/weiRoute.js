const weiController = require('../controllers/weiController');
const express = require('express');
const weiRouter = express.Router();

weiRouter.get('/', weiController.getAll); //get all


module.exports = weiRouter;