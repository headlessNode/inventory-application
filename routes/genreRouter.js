const {Router} = require('express');
const genreRouter = Router();

genreRouter.get('/', (req, res) => {
    res.render('genre');
});

module.exports = genreRouter;