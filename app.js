const path = require('path');
const express = require('express');
const app = express();
const indexRouter = require('./routes/indexRouter');
const gamesRouter = require('./routes/gamesRouter');
const genreRouter = require('./routes/genreRouter');

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', indexRouter);
app.use('/games', gamesRouter);
app.use('/genre', genreRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000');
});