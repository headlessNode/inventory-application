const {Client} = require('pg');

const SQL = `
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255),
    img_url VARCHAR(2000)
);

CREATE TABLE IF NOT EXISTS developers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER,
    developer VARCHAR(255),
    FOREIGN KEY (game_id) REFERENCES games(id)
);

CREATE TABLE IF NOT EXISTS genre (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER,
    genre VARCHAR(255),
    FOREIGN KEY (game_id) REFERENCES games(id)
);

INSERT INTO games (title, img_url) VALUES ('MineCraft', 'https://i.imgur.com/DzbV8Pn.png'), 
('The Finals', 'https://i.imgur.com/4MieKns.jpeg'),
('The Legend Of Zelda: Breath of the Wild', 'https://i.imgur.com/wY8UQLq.jpeg'),
('The Witcher III: The Wild Hunt', 'https://i.imgur.com/LNtrmpY.jpeg');

INSERT INTO developers (game_id, developer) VALUES (1, 'Mojang Studios'),
(2, 'Embark Studios'),
(3, 'Nintendo EPD'),
(3, 'Nintendo'),
(4, 'CD Projekt'),
(4, 'CD Projekt Red');

INSERT INTO genre (game_id, genre) VALUES (1, 'Sandbox'),
(2, 'First-Person Shooter'),
(3, 'Action-Adventure'),
(3, 'Open World'),
(4, 'Action-Adventure'),
(4, 'Open World');
`;

async function main() {
    const client = new Client(
        {
            connectionString: process.argv[2],
        }
    );
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('done');
}

main();