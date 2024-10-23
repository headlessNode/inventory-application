const db = require('../db/query.js');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
require('dotenv').config();

const urlErr = "Invalid URL. Must match https://https://i.imgur.com/*.extension";

const authErr = "Wrong auth code. Please try again.";

const validateUrl = [
    body("img_url").trim().matches(/https:\/\/i.imgur.com\/[a-zA-Z0-9]+./).withMessage(urlErr)
];

const validateAuth = [
    body("auth_code").trim().isNumeric().equals(process.env.AUTH_KEY).withMessage(authErr)
]

const dashboardController = {
    getAll: asyncHandler(
        async (req, res) => {
            const games = await db.getAllGames();
            const developers = await db.getAllDevelopers();
            const genres = await db.getAllGenre();
            res.render('adminDashboard', {games, developers, genres});
        }),
    
    updateGame: [
        validateUrl,
        asyncHandler(
            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    const games = await db.getAllGames();
                    const developers = await db.getAllDevelopers();
                    const genre = await db.getAllGenre();
                    return res.render('adminDashboard', {
                        games,
                        developers,
                        genre,
                        errors: errors.array(),
                    });
                }
                
                const {id, title, img_url, developers, developerIds, genres, genreIds} = req.body;

                const game_id = id;
                let gameDevs = [];
                developers.forEach((developer, i) => {
                    gameDevs.push({
                        id: developerIds[i],
                        developer
                    });
                });

                let gameGenres = [];
                genres.forEach((genre, i) => {
                    gameGenres.push({
                        id: genreIds[i],
                        genre
                    });
                });
                await Promise.all(gameDevs.map(async (dev) => {
                    await db.updateDeveloper(dev.id, game_id, dev.developer);
                }));
                
                await Promise.all(gameGenres.map(async (gen) => {
                    await db.updateGenre(gen.id, game_id, gen.genre);
                }));
                
                await db.updateGame(id, title, img_url);
                
                res.redirect('/admin');
            }
        )
    ],

    authorize: asyncHandler(
        async (req, res) => {
            const {id} = req.body;
            res.render('authorize', {id});
        }
    ),

    deleteGame: [
        validateAuth,
        asyncHandler(
            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.render('errorPage', {
                        errors: errors.array(),
                    });
                }
                const {game_id} = req.body;
                await db.deleteGame(game_id);
                res.redirect('/');
            }
        )
    ],

    addGame: [
        validateUrl,
        asyncHandler(
            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    const games = await db.getAllGames();
                    const developers = await db.getAllDevelopers();
                    const genre = await db.getAllGenre();
                    return res.render('errorPage', {
                        errors: errors.array(),
                    });
                }
                const {title, img_url, developers, genres} = req.body;
                console.log(req.body);
                await db.addGame(title, img_url, developers, genres);
                res.redirect('/');
            }
        )
    ]

}

module.exports = dashboardController;