const mysql = require("mysql");
const config = require("./config.json");

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

// game page routes

// GET /game/:game_id
// list of 2 outputs: home team first, road team second
const game = async function (req, res) {
    connection.query(
        `
        SELECT *
        FROM game_data
        WHERE game_id=${req.params.game_id}
    `,
        (err, data) => {
            if (err || data.length < 2) {
                console.log(err);
                res.json({});
            } else {
                if (data[0].is_home === "f") {
                    temp = data[0];
                    data[0] = data[1];
                    data[1] = temp;
                }
                return res.json(data);
            }
        }
    );
};

// GET /game_players/:game_id
// list of 2 lists: home players first, road players second
const game_players = async function (req, res) {
    connection.query(
        `
        SELECT P.display_first_last, G.is_home, PS.*
        FROM players P JOIN player_stats PS on P.person_id = PS.player_id
            JOIN game_data G ON PS.game_id = G.game_id AND PS.team_id = G.team_id
        WHERE PS.game_id = ${req.params.game_id};
    `,
        (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                output = [[], []];
                for (i = 0; i < data.length; i++) {
                    if (data[i].is_home === "t") {
                        output[0].push(data[i]);
                    } else {
                        output[1].push(data[i]);
                    }
                }
                res.json(output);
            }
        }
    );
};

// GET /game_betting/:game_id
const game_betting = async function (req, res) {
    connection.query(
        `
        SELECT *
        FROM betting_data
        WHERE game_id = ${req.params.game_id};
    `,
        (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                res.json(data);
            }
        }
    );
};

// GET /games_for_team/:team_id
// Fetches game_id, matchup, and game_date for specific team_id
// Ordered by game_date
const games_for_team = async function (req, res) {
    connection.query(
        `
        SELECT G.game_id, G.matchup, G.game_date
        FROM game_data G
        WHERE team_id = ${req.params.team_id}
        ORDER BY G.game_date;
    `,
        (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                res.json(data);
            }
        }
    );
};

// GET /games_for_player/:player_id
// Fetches game_id, matchup, game date, and stats for specific player_id
// Ordered by game_date
const games_for_player = async function (req, res) {
    connection.query(
        `
        SELECT G.matchup, G.game_date, PS.*
        FROM game_data G JOIN player_stats PS on G.game_id = PS.game_id and G.team_id = PS.team_id
        WHERE player_id = ${req.params.player_id}
        ORDER BY G.game_date;
    `,
        (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                res.json(data);
            }
        }
    );
};

/*
    GET /player/:player_id
    Returns player information for specific player_id
*/
const player_information = async function (req, res) {
    connection.query(
        `
        SELECT *
        FROM players
        WHERE person_id = ${req.params.player_id};
    `,
        (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                res.json(data);
            }
        }
    );
};

/*
    GET /player/:player_id/average_stats
    Returns average stats for specific player_id
*/
const player_average_stats = async function (req, res) {
    connection.query(
        `
        SELECT AVG(min) as min, AVG(fgm) as fgm, AVG(fga) as fga, AVG(fg_pct) as fg_pct, AVG(fg3m) as fg3m, AVG(fg3a) as fg3a, AVG(fg3_pct) as fg3_pct, AVG(ftm) as ftm, AVG(fta) as fta, AVG(ft_pct) as ft_pct, AVG(oreb) as oreb, AVG(dreb) as dreb, AVG(reb) as reb, AVG(ast) as ast, AVG(stl) as stl, AVG(blk) as blk, AVG(tov) as tov, AVG(pf) as pf, AVG(pts) as pts, AVG(plus_minus) as plus_minus
        FROM player_stats
        WHERE player_id = ${req.params.player_id};
    `,
        (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                res.json(data);
            }
        }
    );
};

/*
    GET /player/:player_id/spread_performance
    Returns num games the player covered the spread, total games, and percentage of games the player covered the spread
 */
const player_spread_performance = async function (req, res) {
    connection.query(
        `
        WITH total_games AS (
   SELECT P.player_id, COUNT(*) AS total_games
   FROM player_stats P
   GROUP BY P.player_id
)
SELECT P.player_id, COUNT(DISTINCT B.game_id) AS count, TG.total_games, COUNT(DISTINCT B.game_id) / TG.total_games AS spread_percentage
FROM betting_data B JOIN game_data G ON B.game_id = G.game_id AND B.team_id = G.team_id
   JOIN game_data G2 ON B.game_id = G2.game_id AND B.a_team_id = G2.team_id
   JOIN player_stats P on B.game_id = P.game_id
   JOIN total_games TG on P.player_id = TG.player_id
WHERE ((P.team_id = B.team_id AND (G.pts - G2.pts) > -1 * B.spread1)
   OR (P.team_id = B.a_team_id AND (G2.pts - G.pts) > -1 * B.spread2))
   AND TG.total_games > 100
    AND P.player_id = ${req.params.player_id}
GROUP BY P.player_id
ORDER BY COUNT(DISTINCT B.game_id) / TG.total_games DESC;
`,
        (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                res.json(data);
            }
        }
    );
};

// TODO: Add the query into the function
const matchup_stats = async function (req, res) {
    let team1ID = req.params.team1;
    let team2ID = req.params.team2;
    connection.query(
        ``,
        (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                res.json(data);
            }
        }
    );
};

const team = async function (req, res) {
    let team1ID = req.params.team_id;
    connection.query(
        `WITH unique_games_avg AS (
    SELECT team_id, SUM(w) as number_wins, SUM(l) as number_losses, AVG(pts) as avg_points, AVG(reb) as avg_rebounds, AVG(ast) as avg_assists
    FROM game_data GROUP BY team_id
) SELECT name, abbreviation, teams.team_id, number_wins, number_losses, avg_points, avg_rebounds, avg_assists, min_year, max_year
FROM unique_games_avg JOIN teams ON unique_games_avg.team_id = teams.team_id WHERE teams.team_id = ${team1ID};`,
        (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                res.json(data);
            }
        }
    );
};

const team_game_betting_data = async function (req, res) {
    let team1ID = req.params.team_id;
    connection.query(
        `SELECT * FROM betting_data WHERE team_id = ${team1ID};`,
        (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                output = {}
                for (let i = 0; i < data.length; i++) {
                    tempValue = output[data[i].game_id] || [];
                    tempValue.push(data[i]);
                    output[data[i].game_id] = tempValue;
                }
                res.json(output);
            }
        }
    );
};

const team_underdog_wins = async function (req, res) {
    let team1ID = req.params.team_id;
    connection.query(
        `WITH total_underdog_games AS (
   SELECT B.game_id
   FROM betting_data B, game_data G
   WHERE G.team_id = ${team1ID}
       AND B.game_id = G.game_id
       AND G.wl = "W"
       AND ((B.moneyline_price1 > 0)
           OR (B.moneyline_price2 > 0))
   GROUP BY B.game_id
) SELECT G1.*
FROM total_underdog_games UG JOIN betting_data G1 ON UG.game_id = G1.game_id;`,
        (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                output = {}
                for (let i = 0; i < data.length; i++) {
                    tempValue = output[data[i].game_id] || [];
                    tempValue.push(data[i]);
                    output[data[i].game_id] = tempValue;
                }
                res.json(output);
            }
        }
    );
};

const top_players = async function (req, res) {
    let team_id = req.params.team_id;
    let num_players = req.query.num_players;
    connection.query(
        `
        WITH player_stats_avg AS (
    SELECT player_id, team_id, AVG(pts) as avg_pts, AVG(ast) as avg_ast, AVG(reb) as avg_reb
    FROM player_stats
    GROUP BY player_id
)
SELECT player_id, display_last_comma_first, display_first_last, avg_pts, avg_ast, avg_reb, from_year, to_year, player_code, jersey, school, country, last_affiliation
FROM players P JOIN player_stats_avg PSA on P.person_id = PSA.player_id
WHERE team_id = ${team_id}
ORDER BY avg_pts DESC, avg_ast, avg_reb
LIMIT ${num_players}
    `,
        (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                output = [[], []];
                for (i = 0; i < data.length; i++) {
                    if (data[i].is_home === "t") {
                        output[0].push(data[i]);
                    } else {
                        output[1].push(data[i]);
                    }
                }
                res.json(output);
            }
        }
    );
};


module.exports = {
    game,
    game_players,
    game_betting,
    games_for_team,
    games_for_player,
    player_information,
    player_average_stats,
    player_spread_performance,
    matchup_stats,
    team,
    team_game_betting_data,
    team_underdog_wins
};
