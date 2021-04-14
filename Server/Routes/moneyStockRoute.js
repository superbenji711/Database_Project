const moneyStockController = require('../controllers/moneyStockController');
const express = require('express');

const moneyStockRouter = express.Router();

// moneyStockController.getAll();

moneyStockRouter.get('/', moneyStockController.getAll); //get all





module.exports = moneyStockRouter;