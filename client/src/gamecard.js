import React, { useEffect, useState } from 'react';
import {
    Box,
    VStack,
    Text,
    useColorModeValue,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    HStack,
    Input,
    Button,
} from '@chakra-ui/react';
import axios from 'axios';

const GameCard = ({ gameId }) => {
    const [localGameId, setLocalGameId] = useState(gameId);
    const [inputGameId, setInputGameId] = useState('');
    const [gameData, setGameData] = useState([]);
    const [gamePlayers, setGamePlayers] = useState([[], []]);
    const [gameBetting, setGameBetting] = useState([]);
    const [matchupStats, setMatchupStats] = useState([]);
    const [matchupTopPairs, setMatchupTopPairs] = useState([]);
    const textColor = useColorModeValue('gray.700', 'white');
    const cardBg = useColorModeValue('gray.100', 'gray.900');

    useEffect(() => {
        setLocalGameId(gameId);
    }, [gameId]);

    useEffect(() => {
        if (!localGameId) return;
        async function fetchData() {
            try {
                console.log(`/game/${localGameId}`)
                const gameRes = await axios.get(`${process.env.REACT_APP_EXPRESS_APP_API_URL}/game/${localGameId}`);
                setGameData(gameRes.data);
                console.log(gameData);
                console.log(`/game/${localGameId}/players`)
                const gamePlayersRes = await axios.get(`${process.env.REACT_APP_EXPRESS_APP_API_URL}/game/${localGameId}/players`);
                setGamePlayers(gamePlayersRes.data);
                console.log(`/game/${localGameId}/betting`)
                const gameBettingRes = await axios.get(`${process.env.REACT_APP_EXPRESS_APP_API_URL}/game/${localGameId}/betting`);
                setGameBetting(gameBettingRes.data);
                console.log(`/game/${localGameId}/matchup_stats`)
                const matchupStatsRes = await axios.get(`${process.env.REACT_APP_EXPRESS_APP_API_URL}/game/${localGameId}/matchup_stats`);
                setMatchupStats(matchupStatsRes.data);
                console.log(`/game/${localGameId}/matchup_top_pairs`)
                const matchupTopPairs = await axios.get(`${process.env.REACT_APP_EXPRESS_APP_API_URL}/game/${localGameId}/matchup_top_pairs`);
                setMatchupTopPairs(matchupTopPairs.data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [localGameId]);

    // const handleInputChange = (event) => {
    //     setInputGameId(event.target.value);
    // };

    // const handleSubmit = () => {
    //     setGameId(inputGameId);
    // };

    return (
        <Box>
            {/*<HStack>*/}
            {/*    <Text fontSize="md" fontWeight="bold" marginRight="10px">*/}
            {/*        Enter Game ID*/}
            {/*    </Text>*/}
            {/*    <Input*/}
            {/*        value={inputGameId}*/}
            {/*        onChange={handleInputChange}*/}
            {/*        placeholder="Enter game ID"*/}
            {/*        size="sm"*/}
            {/*        width="200px"*/}
            {/*        marginRight="10px"*/}
            {/*    />*/}
            {/*    <Button onClick={handleSubmit} colorScheme="blue" size="sm">*/}
            {/*        Update*/}
            {/*    </Button>*/}
            {/*</HStack>*/}
            {gameId && gameData && gameData[0] && gameData[1] && (
                <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    p={4}
                    w="100%"
                    backgroundColor={cardBg}
                >
                    <Box w="100%">
                        <Text fontSize="xl" fontWeight="bold">
                            Game Data
                        </Text>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Matchup</Th>
                                    <Th>Home Team</Th>
                                    <Th>Away Team</Th>
                                    <Th>Game Date</Th>
                                    <Th>Home Score</Th>
                                    <Th>Away Score</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {/* {gameData.map((game, index) => (
                                    <Tr key={index}>
                                        <Td>{game.team_id}</Td>
                                        <Td>{game.pts}</Td>
                                        <Td>{game.matchup}</Td>
                                        <Td>{game.game_date}</Td>
                                    </Tr>
                                ))} */}
                                <Tr>
                                    <Td>{gameData[0].matchup}</Td>
                                    <Td>{gameData[0].name}</Td>
                                    <Td>{gameData[1].name}</Td>
                                    <Td>{gameData[0].game_date}</Td>
                                    <Td>{gameData[0].pts}</Td>
                                    <Td>{gameData[1].pts}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </Box>

                    <Box w="100%">
                        <Text fontSize="xl" fontWeight="bold">
                            Game Players
                        </Text>
                        {gamePlayers.map((teamPlayers, teamIndex) => (
                            <Box key={teamIndex}>
                                <Text fontWeight="bold" color={textColor}>
                                    {teamIndex === 0 ? 'Home Team Players' : 'Away Team Players'}
                                </Text>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Player Name</Th>
                                            <Th>Minutes</Th>
                                            <Th>Points</Th>
                                            <Th>Rebounds</Th>
                                            <Th>Assists</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {teamPlayers.map((player, index) => (
                                            <Tr key={index}>
                                                <Td>{player.display_first_last}</Td>
                                                <Td>{player.min}</Td>
                                                <Td>{player.pts}</Td>
                                                <Td>{player.reb}</Td>
                                                <Td>{player.ast}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        ))}
                    </Box>

                    <Box w="100%">
                        <Text fontSize="xl" fontWeight="bold">
                            Betting Data
                        </Text>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Book Name</Th>
                                    <Th>Moneyline Price Away</Th>
                                    <Th>Moneyline Price Home</Th>
                                    <Th>Spread Away</Th>
                                    <Th>Spread Price Away</Th>
                                    <Th>Spread Home</Th>
                                    <Th>Spread Price Home</Th>
                                    <Th>Over/Under</Th>
                                    <Th>Over Price</Th>
                                    <Th>Under Price</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {gameBetting.map((bet, index) => (
                                    <Tr key={index}>
                                        <Td>{bet.book_name}</Td>
                                        <Td>{bet.moneyline_price1}</Td>
                                        <Td>{bet.moneyline_price2}</Td>
                                        <Td>{bet.spread1}</Td>
                                        <Td>{bet.spread_price1}</Td>
                                        <Td>{bet.spread2}</Td>
                                        <Td>{bet.spread_price2}</Td>
                                        <Td>{bet.total1}</Td>
                                        <Td>{bet.total_price1}</Td>
                                        <Td>{bet.total_price2}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>

                    <Box w="100%">
                        <Text fontSize="xl" fontWeight="bold">
                            Historical Matchup Stats
                        </Text>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Home Team Wins</Th>
                                    <Th>Away Team Wins</Th>
                                    <Th>Home Team Average Points</Th>
                                    <Th>Away Team Average Points</Th>
                                    <Th>Total Games Played</Th>
                                    <Th>Average Home Spread</Th>
                                    <Th>Average Away Spread</Th>
                                    <Th>Average Over/Under</Th>
                                    <Th>Average Moneyline Price Home</Th>
                                    <Th>Average Moneyline Price Away</Th>
                                    <Th>Spread Covers Home</Th>
                                    <Th>Spread Covers Away</Th>
                                    <Th>Underdog Wins Home</Th>
                                    <Th>Underdog Wins Away</Th>
                                    <Th>Total Moneyline Home</Th>
                                    <Th>Total Moneyline Away</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {matchupStats.map((x, index) => (
                                    <Tr key={index}>
                                        <Td>{x.team1_wins}</Td>
                                        <Td>{x.team2_wins}</Td>
                                        <Td>{x.avg_pts_team1}</Td>
                                        <Td>{x.avg_pts_team2}</Td>
                                        <Td>{x.total_games}</Td>
                                        <Td>{x.avg_spread_team1}</Td>
                                        <Td>{x.avg_spread_team2}</Td>
                                        <Td>{x.average_total}</Td>
                                        <Td>{x.avg_moneyline_price_team1}</Td>
                                        <Td>{x.avg_moneyline_price_team2}</Td>
                                        <Td>{x.spread_success_team1}</Td>
                                        <Td>{x.spread_success_team2}</Td>
                                        <Td>{x.underdog_wins_team1}</Td>
                                        <Td>{x.underdog_wins_team2}</Td>
                                        <Td>{x.total_money_team1}</Td>
                                        <Td>{x.total_money_team2}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                    <Box w="100%">
                        <Text fontSize="xl" fontWeight="bold">
                            Top Player Matchups
                        </Text>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Home Team Player</Th>
                                    <Th>Away Team Player</Th>
                                    <Th>Total Games Played</Th>
                                    <Th>Average Percentage of Points Scored</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {matchupTopPairs.map((y, index) => (
                                    <Tr key={index}>
                                        <Td>{y.player1}</Td>
                                        <Td>{y.player2}</Td>
                                        <Td>{y.total_games}</Td>
                                        <Td>{y.avg_pct_pts}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default GameCard;





