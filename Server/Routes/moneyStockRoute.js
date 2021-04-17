const moneyStockController = require('../controllers/moneyStockController');
const express = require('express');

const moneyStockRouter = express.Router();

moneyStockRouter.get('/', moneyStockController.getPercentChanges);
moneyStockRouter.get('/:symbol', moneyStockController.getCorrelation);

module.exports = moneyStockRouter;