const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect((err) => err && console.log(err));

const test = async function(req, res) {
    connection.query(`
        SELECT *
        FROM teams
        ORDER BY name
    `, (err, data) => {
        if (err || data.length == 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data);
        }
    });
}

// game page routes

// GET /game/:game_id
// list of 2 outputs: home team first, road team second
const game = async function(req, res) {
    connection.query(`
        SELECT *
        FROM game_data
        WHERE game_id=${req.params.game_id}
    `, (err, data) => {
        if (err || data.length < 2) {
            console.log(err);
            res.json({});
        } else {
            if (data[0].is_home == 'f') {
                temp = data[0];
                data[0] = data[1];
                data[1] = temp;
            }
            return res.json(data);
        }
    })
}

// GET /game_players/:game_id
// list of 2 lists: home players first, road players second
const game_players = async function(req, res) {
    connection.query(`
        SELECT P.display_first_last, G.is_home, PS.*
        FROM players P JOIN player_stats PS on P.person_id = PS.player_id
            JOIN game_data G ON PS.game_id = G.game_id AND PS.team_id = G.team_id
        WHERE PS.game_id = ${req.params.game_id};
    `, (err, data) => {
        if (err || data.length == 0) {
            console.log(err);
            res.json({});
        } else {
            output = [[], []];
            for (i = 0; i < data.length; i++) {
                if (data[i].is_home == 't') {
                    output[0].push(data[i]);
                } else {
                    output[1].push(data[i]);
                }
            }
            res.json(output);
        }
    });
}

// GET /game_betting/:game_id
const game_betting = async function(req, res) {
    connection.query(`
        SELECT *
        FROM betting_data
        WHERE game_id = ${req.params.game_id};
    `, (err, data) => {
        if (err || data.length == 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data);
        }
    });
}

module.exports = {
    test,
    game,
    game_players,
    game_betting,
}
