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
    let team1ID = req.query.team1;
    let team2ID = req.query.team2;
    connection.query(
        `WITH win_loss AS (
            SELECT SUM(IF(G.wl = 'W', 1, 0)) AS team1_wins, SUM(IF(G.wl = 'L', 1, 0)) AS team2_wins,
                   AVG(G.pts) AS avg_pts_team1, AVG(G2.pts) AS avg_pts_team2, COUNT(DISTINCT G.game_id) AS total_games
            FROM game_data G JOIN game_data G2 ON G.game_id = G2.game_id AND G.a_team_id = G2.team_id
            WHERE G.team_id = ${team1ID} AND G.a_team_id = ${team2ID}
        ),
        betting_averages AS (
            SELECT AVG(IF(B.team_id = ${team1ID}, B.spread1, B.spread2)) AS avg_spread_team1,
                   AVG(IF(B.team_id = ${team2ID}, B.spread1, B.spread2)) AS avg_spread_team2,
                   AVG(B.total1) AS average_total,
                   AVG(IF(B.team_id = ${team1ID}, B.moneyline_price1, B.moneyline_price2)) AS avg_moneyline_price_team1,
                   AVG(IF(B.team_id = ${team2ID}, B.moneyline_price1, B.moneyline_price2)) AS avg_moneyline_price_team2
            FROM betting_data B
            WHERE (B.team_id = ${team1ID} AND B.a_team_id = ${team2ID})
               OR (B.a_team_id = ${team1ID} AND B.team_id = ${team2ID})
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
                    AVG(ABS((G2.pts - G.pts) - B.spread1)) AS average_spread_error
            FROM game_data G, game_data G2, betting_data B
            WHERE G.team_id = ${team1ID} AND G.a_team_id = ${team2ID}
                AND G.game_id = G2.game_id AND G.a_team_id = G2.team_id
                AND B.game_id = G.game_id
                AND ((B.team_id = G.team_id AND B.a_team_id = G.a_team_id)
                    OR (B.team_id = G.a_team_id AND B.a_team_id = G.team_id))
                AND B.book_name = '5Dimes'
        )
        SELECT *
        FROM win_loss, betting_averages, advanced_betting_stats;`,
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

const matchup_top_pairs = async function (req, res) {
    let team1ID = req.query.team1;
    let team2ID = req.query.team2;
    connection.query(`
    WITH total_games AS (
        SELECT PS1.player_id AS id1, PS2.player_id AS id2, COUNT(DISTINCT PS1.game_id) AS total_games
        FROM player_stats PS1 JOIN player_stats PS2 ON PS1.game_id = PS2.game_id AND PS1.team_id <> PS2.team_id
        WHERE PS1.team_id = ${team1ID} AND PS2.team_id = ${team2ID}
        GROUP BY PS1.player_id, PS2.player_id
    )
    SELECT P1.display_first_last AS player1, P2.display_first_last AS player2, AVG((PS1.pts + PS2.pts) / (G1.pts + G2.pts)) AS avg_pct_pts
    FROM player_stats PS1 JOIN player_stats PS2 ON PS1.game_id = PS2.game_id AND PS1.team_id <> PS2.team_id
        JOIN game_data G1 ON PS1.game_id = G1.game_id AND PS1.team_id = G1.team_id
        JOIN game_data G2 ON PS1.game_id = G2.game_id AND PS2.team_id = G2.team_id
        JOIN players P1 ON PS1.player_id = P1.person_id
        JOIN players P2 ON PS2.player_id = P2.person_id
        JOIN total_games TG ON PS1.player_id = TG.id1 AND PS2.player_id = TG.id2
    WHERE PS1.team_id = ${team1ID} AND PS2.team_id = ${team2ID} AND TG.total_games >= 3
    GROUP BY PS1.player_id, PS2.player_id
    ORDER BY AVG((PS1.pts + PS2.pts) / (G1.pts + G2.pts)) DESC;
    `, (err, data) => {
        if (err || data.length == 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data);
        }
    });
}

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
                res.json(data);
            }
        }
    );
};

// trivia page

const middling_total_betting = async function (req, res) {
    let threshold = req.query.threshold;
    connection.query(
        `SELECT SUM(IF(G1.pts + G2.pts > B1.total1, 10000 / ABS(B1.total_price1), IF(G1.pts + G2.pts = B1.total1, 0, -100)))
        + SUM(IF(G1.pts + G2.pts < B2.total1, 10000 / ABS(B2.total_price1), IF(G1.pts + G2.pts = B2.total1, 0, -100))) AS middle_total_money,
        SUM(IF(G1.pts + G2.pts > B1.total1 AND G1.pts + G2.pts < B2.total1, 1, 0)) AS middles_total_won,
        SUM(IF(G1.pts + G2.pts > B1.total1 AND G1.pts + G2.pts < B2.total1, 0, 1)) AS middles_total_lost
        FROM betting_data B1 JOIN betting_data B2 on B1.game_id = B2.game_id
        JOIN game_data G1 ON B1.game_id = G1.game_id AND B1.team_id = G1.team_id
        JOIN game_data G2 ON B1.game_id = G2.game_id AND B1.a_team_id = G2.team_id
        WHERE B1.total1 <= B2.total1 - ${threshold};`,
        (err, data) => {
            if (err || data.length == 0) {
                console.log(err);
            } else {
                res.json(data);
            }
        }
    )
}

const middling_spread_betting = async function (req, res) {
    let threshold = req.query.threshold;
    connection.query(
        `SELECT SUM(IF(G1.pts + G2.pts > B1.total1, 10000 / ABS(B1.total_price1), IF(G1.pts + G2.pts = B1.total1, 0, -100)))
        + SUM(IF(G1.pts + G2.pts < B2.total1, 10000 / ABS(B2.total_price1), IF(G1.pts + G2.pts = B2.total1, 0, -100))) AS middle_total_money,
        SUM(IF(G1.pts + G2.pts > B1.total1 AND G1.pts + G2.pts < B2.total1, 1, 0)) AS middles_total_won,
        SUM(IF(G1.pts + G2.pts > B1.total1 AND G1.pts + G2.pts < B2.total1, 0, 1)) AS middles_total_lost
        FROM betting_data B1 JOIN betting_data B2 on B1.game_id = B2.game_id
        JOIN game_data G1 ON B1.game_id = G1.game_id AND B1.team_id = G1.team_id
        JOIN game_data G2 ON B1.game_id = G2.game_id AND B1.a_team_id = G2.team_id
        WHERE B1.total1 <= B2.total1 - ${threshold};`,
        (err, data) => {
            if (err || data.length == 0) {
                console.log(err);
            } else {
                res.json(data);
            }
        }
    )
}


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
    matchup_top_pairs,
    team,
    team_game_betting_data,
    team_underdog_wins,
    middling_total_betting,
    middling_spread_betting,
};
