const {Router} = require('express');
const indexRouter = Router();
const gamesController = require('../controllers/gamesController.js');

indexRouter.get('/', gamesController.getAll);
indexRouter.get('/filter', gamesController.filter);

module.exports = indexRouter;