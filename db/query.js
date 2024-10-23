require('dotenv').config();
const pool = require('./pool.js');

/**
 * Retrieves all games from the database.
 *
 * @return {object} Returns an array of objects, where each object represents a game.
 */
async function getAllGames(){
    const {rows} = await pool.query('SELECT * FROM games');
    return rows;
}

/**
 * Retrieves all distinct developers from the database.
 *
 * @return {object} Returns an array of objects, where each object has an 'id', 'developer' and 'game_id property.
 */
async function getAllDevelopers(){
    const {rows} = await pool.query('SELECT DISTINCT id, developer, game_id FROM developers ORDER BY developer ASC');
    return rows;
}

/**
 * Retrieves all distinct developers from the database.
 *
 * @return {object} Returns an array of objects, where each object has a 'developer' property.
 */
async function getAllDevelopersWithoutIds(){
    const {rows} = await pool.query('SELECT DISTINCT developer FROM developers ORDER BY developer ASC');
    return rows;
}

/**
 * Retrieves all distinct genres from the database.
 *
 * @return {object} Returns an array of objects, where each object has a 'genre' and 'game_id' property.
 */
async function getAllGenre(){
    const {rows} = await pool.query('SELECT DISTINCT id, genre, game_id FROM genre ORDER BY genre ASC');
    return rows;
}

/**
 * Retrieves all distinct genres from the database.
 *
 * @return {object} Returns an array of objects, where each object has a 'genre' property.
 */
async function getAllGenreWithoutIds(){
    const {rows} = await pool.query('SELECT DISTINCT genre FROM genre ORDER BY genre ASC');
    return rows;
}

/**
 * Filters games by developer and genre.
 *
 * @param {String} developer The developer to filter by.
 * @param {String} genre The genre to filter by.
 * @return {object} Returns an array of filtered game objects.
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

/**
 * Updates the developer of a game with the given id.
 *
 * @param {Number} id The id of the game to update.
 * @param {String} developer The new developer of the game.
 * @return {void} Returns void.
 */
async function updateDeveloper(id, game_id, developer){
    await pool.query(
        `UPDATE developers
        SET developer = $1
        WHERE developers.game_id = ${game_id} AND developers.id = ${id}`, [developer]
    );
}

/**
 * Updates the genre of a game with the given id.
 *
 * @param {Number} id The id of the game to update.
 * @param {String} genre The new genre of the game.
 * @return {void} Returns void.
 */
async function updateGenre(id, game_id, genre){
    await pool.query(
        `UPDATE genre
        SET genre = $1
        WHERE genre.game_id = ${game_id} AND genre.id = ${id}`, [genre]
    );
}

/**
 * Deletes a game and its associated developers and genres from the database.
 *
 * @param {Number} id The id of the game to delete.
 * @return {void} Returns void.
 */
async function deleteGame(id){
    await pool.query('DELETE FROM developers WHERE developers.game_id = $1', [id]);
    await pool.query('DELETE FROM genre WHERE genre.game_id = $1', [id]);
    await pool.query('DELETE FROM games WHERE games.id = $1', [id]);
}

/**
 * Adds a new game to the database along with its developers and genres.
 *
 * @param {String} title The title of the game.
 * @param {String} img_url The image URL of the game.
 * @param {Array} developers An array of developers associated with the game.
 * @param {Array} genres An array of genres associated with the game.
 * @return {void} Returns void.
 */
async function addGame(title, img_url, developers, genres){
    await pool.query(
        `INSERT INTO games
        (title, img_url)
        VALUES
        ($1, $2)`, [title, img_url]
    );

    const {rows} = await pool.query('SELECT id FROM games WHERE title = $1', [title]);
    const game_id = rows[0].id;

    developers.forEach(async (developer) => {
        await pool.query(
            `INSERT INTO developers
            (developer, game_id)
            VALUES
            ($1, $2)`, [developer, game_id]
        );
    });

    genres.forEach(async (genre) => {
        await pool.query(
            `INSERT INTO genre
            (genre, game_id)
            VALUES
            ($1, $2)`, [genre, game_id]
        );
    });
}

module.exports = {
    getAllGames,
    getAllDevelopers,
    getAllDevelopersWithoutIds,
    getAllGenre,
    getAllGenreWithoutIds,
    filterGames,
    updateGame,
    updateGenre,
    updateDeveloper,
    deleteGame,
    addGame
};