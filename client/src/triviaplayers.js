import React, { useState, useEffect } from 'react';
import {
    VStack,
    Heading,
    Box,
    Text,
    Input,
    Button,
    Grid,
    FormControl,
    FormLabel,
    useToast, Tbody, Table, Thead, Th, Tr, Td, Flex, Center,
    useColorModeValue
} from '@chakra-ui/react';
import axios from 'axios';


const TriviaPlayersPage = () => {
    
    const [playerMatchups, setPlayerMatchups] = useState([]);
    const [spreadPlayers, setSpreadPlayers] = useState([]);
    const [underdogPlayers, setUnderdogPlayers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                console.log(`/trivia/top_matchups`);
                const matchupRes = await axios.get(`${process.env.REACT_APP_EXPRESS_APP_API_URL}/trivia/top_matchups`);
                setPlayerMatchups(matchupRes.data);
                console.log(`/trivia/spread_players`);
                const spreadRes = await axios.get(`${process.env.REACT_APP_EXPRESS_APP_API_URL}/trivia/spread_players`);
                setSpreadPlayers(spreadRes.data);
                console.log(`/trivia/underdog_players`);
                const underdogRes = await axios.get(`${process.env.REACT_APP_EXPRESS_APP_API_URL}/trivia/underdog_players`);
                setUnderdogPlayers(underdogRes.data);
            } catch(err) {
                console.log(err);
            }
        }

        fetchData();
    }, []);

    return (
        <Flex direction="row">
        <VStack spacing={6}>
            <Text fontSize="xl" fontWeight="bold">
            Top Player Matchups
          </Text>
            <Table mt={6} variant="simple" width="100%">
                <Thead>
                    <Tr>
                        <Th>Player 1</Th>
                        <Th>Player 2</Th>
                        <Th>Total Games</Th>
                        <Th>Average Percentage of Points Scored</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {playerMatchups.map((pair, index) => (
                                    <Tr key={index}>
                                        <Td>{pair.name1}</Td>
                                        <Td>{pair.name2}</Td>
                                        <Td>{pair.total_games}</Td>
                                        <Td>{(pair.avg_pct_pts * 100).toFixed(2)}%</Td>
                                    </Tr>
                                ))}
                </Tbody>
            </Table>
            <Text fontSize="xl" fontWeight="bold">
            Top Players for Spread Cover
          </Text>
            <Table mt={6} variant="simple" width="100%">
                <Thead>
                    <Tr>
                        <Th>Player</Th>
                        <Th>Spread Covers</Th>
                        <Th>Total Games</Th>
                        <Th>Spread Cover Percentage</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {spreadPlayers.map((x, index) => (
                                    <Tr key={index}>
                                        <Td>{x.display_first_last}</Td>
                                        <Td>{x.count}</Td>
                                        <Td>{x.total_games}</Td>
                                        <Td>{(x.spread_percentage * 100).toFixed(2)}%</Td>
                                    </Tr>
                                ))}
                </Tbody>
            </Table>
            <Text fontSize="xl" fontWeight="bold">
            Top Players as Underdogs
          </Text>
            <Table mt={6} variant="simple" width="100%">
                <Thead>
                    <Tr>
                        <Th>Player</Th>
                        <Th>Underdog Games</Th>
                        <Th>Underdog Wins</Th>
                        <Th>Total Money</Th>
                        <Th>Money Per Game</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {underdogPlayers.map((x, index) => (
                                    <Tr key={index}>
                                        <Td>{x.display_first_last}</Td>
                                        <Td>{x.total_games}</Td>
                                        <Td>{x.underdog_wins}</Td>
                                        <Td>{x.total_money.toFixed(2)}</Td>
                                        <Td>{x.money_per_game.toFixed(2)}</Td>
                                    </Tr>
                                ))}
                </Tbody>
            </Table>
        </VStack>
        </Flex>
    );
};

export default TriviaPlayersPage;
