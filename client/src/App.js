import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './home';
import GamePage from './game';
// import PlayerPage from './PlayerPage';
import TeamPage from './team';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/game" element={<GamePage />} />
                {/*<Route path="/player" element={<PlayerPage />} />*/}
                <Route path="/team" element={<TeamPage />} />
            </Routes>
        </Router>
    );
}

export default App;
