const {Router} = require('express');
const gamesRouter = Router();
const gamesController = require('../controllers/gamesController.js');

gamesRouter.get('/', gamesController.getAll);

module.exports = gamesRouter;