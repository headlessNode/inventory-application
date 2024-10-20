const db = require('../db/query.js');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

const urlErr = "Invalid URL. Must match https://https://i.imgur.com/*.png";

const validateUrl = [
    body("img_url").trim().matches(/https:\/\/i.imgur.com\/[a-zA-Z0-9]+\.png/).withMessage(urlErr)
];

const dashboardController = {
    getAll: asyncHandler(
        async (req, res) => {
            const games = await db.getAllGames();
            const developers = await db.getAllDevelopers();
            const genre = await db.getAllGenre();
            res.render('adminDashboard', {games, developers, genre});
        }),
    
    updateGame: [
        validateUrl,
        asyncHandler(
            async (req, res) => {
                const errors = validationResult(req);
                console.log(errors.array());
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
                const {id, title, img_url} = req.body;
                await db.updateGame(id, title, img_url);
                res.redirect('/admin');
            }
        )
    ]
}

module.exports = dashboardController;