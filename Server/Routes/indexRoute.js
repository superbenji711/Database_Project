const indexController = require('../controllers/indexController');
// const express = require() 'express';
const express = require('express');

const indexRouter = express.Router();


indexRouter.get('/', indexController.getAll); //get all

module.exports = indexRouter;