const {Router} = require('express');
const dashboardRouter = Router();

dashboardRouter.get('/', (req, res) => {
    res.render('adminDashboard');
});

module.exports = dashboardRouter;