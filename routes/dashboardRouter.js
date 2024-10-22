const {Router} = require('express');
const dashboardRouter = Router();
const dashboardController = require('../controllers/dashboardController.js');

dashboardRouter.get('/', dashboardController.getAll);

dashboardRouter.post('/updategame', dashboardController.updateGame);

dashboardRouter.post('/authorize', dashboardController.authorize);

dashboardRouter.post('/deletegame', dashboardController.deleteGame);

module.exports = dashboardRouter;