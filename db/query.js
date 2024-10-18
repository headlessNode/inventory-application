require('dotenv').config();
const pool = require('./pool.js');

async function getAllGames(){
    const {rows} = await pool.query('SELECT * FROM games');
    return rows;
}

async function getAllDevelopers(){
    const {rows} = await pool.query('SELECT DISTINCT developer FROM developers ORDER BY developer ASC');
    return rows;
}

async function getAllGenre(){
    const {rows} = await pool.query('SELECT DISTINCT genre FROM genre ORDER BY genre ASC');
    return rows;
}

async function filterGames(developer, genre){
    if(developer === 'All' && genre === 'All'){
        return 'All';
    }else if(developer !== 'All' && genre !== 'All' ){
        const {rows} = await pool.query(
            `SELECT DISTINCT title, img_url, developer, genre FROM games
            INNER JOIN developers ON games.id = developers.game_id
            INNER JOIN genre ON games.id = genre.game_id
            WHERE developer = $1 AND genre = $2`, [developer, genre]);
        return rows;
    }else if(developer === 'All' && genre !== 'All'){
        const {rows} = await pool.query(
            `SELECT DISTINCT title, img_url, STRING_AGG(developer, ', ') AS developer, genre FROM games
            INNER JOIN developers ON games.id = developers.game_id
            INNER JOIN genre ON games.id = genre.game_id
            WHERE genre = $1
            GROUP BY title, img_url, genre`, [genre]);
        return rows;
    }else if(developer !== 'All' && genre === 'All'){
        const {rows} = await pool.query(
            `SELECT DISTINCT title, img_url, developer, STRING_AGG(genre, ', ') AS genre FROM games
            INNER JOIN developers ON games.id = developers.game_id
            INNER JOIN genre ON games.id = genre.game_id
            WHERE developer = $1
            GROUP BY title, img_url, developer`, [developer]);
        return rows;
    }
}

module.exports = {
    getAllGames,
    getAllDevelopers,
    getAllGenre,
    filterGames
};