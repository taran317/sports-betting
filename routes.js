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

// GET /games_for_team/:team_id
// Fetches game_id, matchup, and game_date for specific team_id
// Ordered by game_date
const games_for_team = async function(req, res) {
    connection.query(`
        SELECT G.game_id, G.matchup, G.game_date
        FROM game_data G
        WHERE team_id = ${req.params.team_id}
        ORDER BY G.game_date;
    `, (err, data) => {
        if (err || data.length == 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data);
        }
    });
}

// GET /games_for_player/:player_id
// Fetches game_id, matchup, game date, and stats for specific player_id
// Ordered by game_date
const games_for_player = async function(req, res) {
    connection.query(`
        SELECT G.matchup, G.game_date, PS.*
        FROM game_data G JOIN player_stats PS on G.game_id = PS.game_id and G.team_id = PS.team_id
        WHERE player_id = ${req.params.player_id}
        ORDER BY G.game_date;
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
    game,
    game_players,
    game_betting,
    games_for_team,
    games_for_player,
}
