require('dotenv').config();
const pool = require('./pool.js');

/**
 * Retrieves all games from the database.
 *
 * @return {Promise<Object[]>} The result of the query as an array of objects, where each object represents a game.
 */
async function getAllGames(){
    const {rows} = await pool.query('SELECT * FROM games');
    return rows;
}

/**
 * Retrieves all distinct developers from the database.
 *
 * @return {Promise<Object[]>} The result of the query as an array of objects, where each object has a 'developer' property.
 */
async function getAllDevelopers(){
    const {rows} = await pool.query('SELECT DISTINCT developer FROM developers ORDER BY developer ASC');
    return rows;
}


/**
 * Retrieves all distinct genres from the database.
 *
 * @return {Promise<Object[]>} The result of the query as an array of objects, where each object has a 'genre' property.
 */
async function getAllGenre(){
    const {rows} = await pool.query('SELECT DISTINCT genre FROM genre ORDER BY genre ASC');
    return rows;
}

/**
 * Filters games by developer and genre.
 *
 * @param {String} developer The developer to filter by.
 * @param {String} genre The genre to filter by.
 * @return {Promise<Object[]>|String} The result of the query.
 */
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

/**
 * Updates the title and img_url of a game with the given id.
 *
 * @param {Number} id The id of the game to update.
 * @param {String} title The new title of the game.
 * @param {String} img_url The new url of the game.
 * @return {Promise<void>} A promise that resolves when the update has been completed.
 */
async function updateGame(id, title, img_url){
    await pool.query(
        `UPDATE games
        SET title = $1, img_url = $2
        WHERE games.id = ${id}`, [title, img_url]
    );
}

module.exports = {
    getAllGames,
    getAllDevelopers,
    getAllGenre,
    filterGames,
    updateGame
};