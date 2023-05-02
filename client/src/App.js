import React from 'react';
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './home';
import GamePage from './game';
import GameCard from './gamecard';
// import PlayerPage from './PlayerPage';
import TeamPage from './team';
import TriviaPage from './trivia';
import TriviaPlayersPage from './triviaplayers';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/game/:gameId" element={<GameCard />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/trivia" element={<TriviaPage />} />
                <Route path="/trivia_players" element={<TriviaPlayersPage />} />
            </Routes>
        </Router>
    );

}

export default App;
