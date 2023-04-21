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

const matchup_stats = async function(req, res) {
    team1 = req.query.team1;
    team2 = req.query.team2;
    connection.query(`
        WITH win_loss AS (
            SELECT SUM(IF(G.wl = 'W', 1, 0)) AS team1_wins, SUM(IF(G.wl = 'L', 1, 0)) AS team2_wins,
                AVG(G.pts) AS avg_pts_team1, AVG(G2.pts) AS avg_pts_team2, COUNT(DISTINCT G.game_id) AS total_games
            FROM game_data G JOIN game_data G2 ON G.game_id = G2.game_id AND G.a_team_id = G2.team_id
            WHERE G.team_id = ${team1} AND G.a_team_id = ${team2}
        ),
        betting_averages AS (
            SELECT AVG(IF(B.team_id = ${team1}, B.spread1, B.spread2)) AS avg_spread_team1,
                AVG(IF(B.team_id = ${team2}, B.spread1, B.spread2)) AS avg_spread_team2,
                AVG(B.total1) AS average_total,
                AVG(IF(B.team_id = ${team1}, B.moneyline_price1, B.moneyline_price2)) AS avg_moneyline_price_team1,
                AVG(IF(B.team_id = ${team2}, B.moneyline_price1, B.moneyline_price2)) AS avg_moneyline_price_team2
            FROM betting_data B
            WHERE (B.team_id = ${team1} AND B.a_team_id = ${team2})
            OR (B.a_team_id = ${team1} AND B.team_id = ${team2})
        ),
        advanced_betting_stats AS (
            SELECT SUM(IF(B.team_id = G.team_id, IF((G.pts - G2.pts) > -1 * B.spread1, 1, 0),
                        IF((G2.pts - G.pts) > -1 * B.spread2, 1, 0))) AS spread_success_team1,
                    SUM(IF(B.team_id = G.team_id, IF((G.pts - G2.pts) > -1 * B.spread1, 0, 1),
                        IF((G2.pts - G.pts) > -1 * B.spread2, 0, 1))) AS spread_success_team2,
                    SUM(IF(B.team_id = G.team_id, IF(B.moneyline_price1 > 0 AND G.wl = 'W', 1, 0),
                        IF(B.moneyline_price2 > 0 AND G.wl = 'L', 1, 0))) AS underdog_wins_team1,
                    SUM(IF(B.team_id = G2.team_id, IF(B.moneyline_price1 > 0 AND G2.wl = 'W', 1, 0),
                        IF(B.moneyline_price2 > 0 AND G2.wl = 'L', 1, 0))) AS underdog_wins_team2,
                    SUM(IF(B.team_id = G.team_id, IF(G.wl = 'W',
                            IF(B.moneyline_price1 > 0, B.moneyline_price1, 10000 / B.moneyline_price1 * -1), -100),
                        IF(G.wl = 'L',
                            IF(B.moneyline_price2 > 0, B.moneyline_price2, 10000 / B.moneyline_price2 * -1), -100)))
                        AS total_money_team1,
                    SUM(IF(B.team_id = G2.team_id, IF(G2.wl = 'W',
                            IF(B.moneyline_price1 > 0, B.moneyline_price1, 10000 / B.moneyline_price1 * -1), -100),
                        IF(G2.wl = 'L',
                            IF(B.moneyline_price2 > 0, B.moneyline_price2, 10000 / B.moneyline_price2 * -1), -100)))
                        AS total_money_team2,
                    AVG(ABS(ABS(G.pts - G2.pts) - ABS(B.spread1))) AS average_spread_error
            FROM game_data G, game_data G2, betting_data B
            WHERE G.team_id = ${team1} AND G.a_team_id = ${team2}
                AND G.game_id = G2.game_id AND G.a_team_id = G2.team_id
                AND B.game_id = G.game_id
                AND ((B.team_id = G.team_id AND B.a_team_id = G.a_team_id)
                    OR (B.team_id = G.a_team_id AND B.a_team_id = G.team_id))
                AND B.book_name = '5Dimes'
        )
        SELECT *
        FROM win_loss, betting_averages, advanced_betting_stats;
    `, (err, data) => {
        if (err || data.length == 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data[0]);
        }
    })
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
    matchup_stats
}
