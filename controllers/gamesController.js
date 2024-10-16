const db = require('../db/query.js');

const gamesController = {
    getAll: async (req, res) => {
        const games = await db.getAllGames();
        res.render('games', {games});
    }
};

module.exports = gamesController;