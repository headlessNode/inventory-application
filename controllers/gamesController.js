const db = require('../db/query.js');
const asyncHandler = require('express-async-handler');
const {NotFoundError} = require('../errors/CustomErrors.js');

const gamesController = {
        getAll: asyncHandler(
            async (req, res) => {
            const games = await db.getAllGames();
            const developers = await db.getAllDevelopersWithoutIds();
            const genre = await db.getAllGenreWithoutIds();

            if(!games) {
                throw new NotFoundError('No games found');
            }
            if(!developers) {
                throw new NotFoundError('No developers found');
            }
            if(!genre) {
                throw new NotFoundError('No genre found');
            }

            res.render('index', {games, developers, genre});
        }),
        filter: asyncHandler(
            async (req, res) => {
                const developerQuery = req.query.developer;
                const genreQuery = req.query.genre;
                if(developerQuery === 'All' && genreQuery === 'All'){
                    res.redirect('/');
                }else{
                    const games = await db.filterGames(developerQuery, genreQuery);
                    const developers = await db.getAllDevelopersWithoutIds();
                    const genre = await db.getAllGenreWithoutIds();
                    if(!games) {
                        throw new NotFoundError('No games found');
                    }
                    if(!developers) {
                        throw new NotFoundError('No developer found');
                    }
                    if(!genre) {
                        throw new NotFoundError('No genre found');
                    }
    
                    res.render('index', {games, developers, genre});
                }
        })
};

module.exports = gamesController;