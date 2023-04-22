import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {
    Box,
    VStack,
    Text,
    Heading,
    useColorModeValue,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from '@chakra-ui/react';
import axios from 'axios';

const GamePage = () => {
    const {game_id} = useParams();
    const [gameData, setGameData] = useState([]);
    const [gamePlayers, setGamePlayers] = useState([[], []]);
    const [gameBetting, setGameBetting] = useState([]);
    const textColor = useColorModeValue('gray.700', 'white');

    useEffect(() => {
        async function fetchData() {
            try {
                console.log("here");
                console.log(`${process.env.EXPRESS_APP_API_URL}/game/${game_id}`);
                const gameRes = await axios.get(`${process.env.EXPRESS_APP_API_URL}/game/${game_id}`);
                setGameData(gameRes.data);

                const gamePlayersRes = await axios.get(`${process.env.EXPRESS_APP_API_URL}/game/${game_id}/players`);
                setGamePlayers(gamePlayersRes.data);

                const gameBettingRes = await axios.get(`${process.env.EXPRESS_APP_API_URL}/game/${game_id}/betting`);
                setGameBetting(gameBettingRes.data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [game_id]);

    return (
        <VStack spacing={6}>
            <Heading as="h1">Game Information</Heading>

            <Box w="100%">
                <Text fontSize="xl" fontWeight="bold">
                    Game Data
                </Text>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Team</Th>
                            <Th>Points</Th>
                            <Th>Matchup</Th>
                            <Th>Game Date</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {gameData.map((game, index) => (
                            <Tr key={index}>
                                <Td>{game.team_id}</Td>
                                <Td>{game.pts}</Td>
                                <Td>{game.matchup}</Td>
                                <Td>{game.game_date}</Td>
                            </Tr>
                        ))}
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
                                    <Th>Position</Th>
                                    <Th>Points</Th>
                                    <Th>Rebounds</Th>
                                    <Th>Assists</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {teamPlayers.map((player, index) => (
                                    <Tr key={index}>
                                        <Td>{player.display_first_last}</Td>
                                        <Td>{player.pos}</Td>
                                        <Td>{player.pts}</Td>
                                        <Td>{player.totReb}</Td>
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
                            <Th>Betting Line</Th>
                            <Th>Home Team Odds</Th>
                            <Th>Away Team Odds</Th>
                            <Th>Over/Under</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {gameBetting.map((bet, index) => (
                            <Tr key={index}>
                                <Td>{bet.betting_line}</Td>
                                <Td>{bet.home_odds}</Td>
                                <Td>{bet.away_odds}</Td>
                                <Td>{bet.over_under}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </VStack>
    );
};

export default GamePage;

