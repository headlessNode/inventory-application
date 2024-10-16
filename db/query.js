require('dotenv').config();
const pool = require('./pool.js');

async function getAllGames(){
    const {rows} = await pool.query('SELECT * FROM games');
    return rows;
}


//get games by genre

//get games by developer

module.exports = {
    getAllGames
};