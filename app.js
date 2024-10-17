const path = require('path');
const express = require('express');
const app = express();
const indexRouter = require('./routes/indexRouter');
const dashboardRouter = require('./routes/dashboardRouter');

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', indexRouter);
app.use('/filter', indexRouter);
app.use('/admin', dashboardRouter);

app.use((err, req, res, next)=>{
    console.error(err);
    res.status(err.statusCode || 500).send(err.message);
});

app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000');
});