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

app.get('/game/search', routes.game_search);
app.get('/game/:game_id', routes.game);
app.get('/game/:game_id/players', routes.game_players);
app.get('/game/:game_id/betting', routes.game_betting);

app.get('/player/search', routes.player_search);
app.get('/player/:player_id/games', routes.games_for_player);
app.get('/player/:player_id', routes.player_information);
app.get('/player/:player_id/average_stats', routes.player_average_stats);
app.get('/player/:player_id/spread_performance', routes.player_spread_performance);

app.get('/team/search', routes.team_search);
app.get('/team/underdog-winrate', routes.team_underdog_winrate);
app.get('/team/:team_id', routes.team);
app.get('/team/:team_id/game-betting-data', routes.team_game_betting_data);
app.get('/team/:team_id/underdog-wins', routes.team_underdog_wins);
app.get('/team/:team_id/top-players', routes.team_top_players);
app.get('/team/:team_id/games', routes.games_for_team);
app.get('/team/:team_id/spread-covering-percentage', routes.team_spread_covering_percentage);

app.get('/trivia/middling_total', routes.middling_total_betting);
app.get('/trivia/middling_spread', routes.middling_spread_betting);
app.get('/trivia/matchup_stats', routes.matchup_stats);
app.get('/trivia/matchup_top_pairs', routes.matchup_top_pairs);




app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
