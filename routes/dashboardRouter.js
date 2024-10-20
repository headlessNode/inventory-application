const {Router} = require('express');
const dashboardRouter = Router();
const dashboardController = require('../controllers/dashboardController.js');

dashboardRouter.get('/', dashboardController.getAll);

dashboardRouter.post('/updategame', dashboardController.updateGame);

module.exports = dashboardRouter;