const express = require('express');
const cors = require('cors');
const config = require('./config.json');
const routes = require('./routes');

const app = express();
app.use(cors({
    origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/game/:game_id', routes.game);
app.get('/game_players/:game_id', routes.game_players);
app.get('/game_betting/:game_id', routes.game_betting);
app.get('/games_for_team/:team_id', routes.games_for_team);
app.get('/games_for_player/:player_id', routes.games_for_player);
app.get('/player/:player_id', routes.player_information);
app.get('/player/:player_id/average_stats', routes.player_average_stats);
app.get('/player/:player_id/spread_performance', routes.player_spread_performance);

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
