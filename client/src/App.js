import React from 'react';
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './home';
import GamePage from './game';
import GameCard from './gamecard';
// import PlayerPage from './PlayerPage';
import TeamPage from './team';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/gaming/:gameId" element={<GameCard />} />
                <Route path="/team" element={<TeamPage />} />
            </Routes>
        </Router>
    );
}

export default App;
