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
    useToast, Tbody, Table, Thead, Th, Tr, Td, Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import GameCard from './gamecard';

const GamePage = () => {
    const [gameData, setGameData] = useState(null);
    const [team1Substring, setTeam1Substring] = useState('');
    const [team2Substring, setTeam2Substring] = useState('');
    const [minPts, setMinPts] = useState('');
    const [minYear, setMinYear] = useState('');
    const [maxYear, setMaxYear] = useState('');
    const [page, setPage] = useState(1);

    const toast = useToast();

    const handleSearch = async (page = 1) => {
        try {

            const queryParams = {
                'page': page,
            };

            if (team1Substring) {
                queryParams['name-or-abbreviation1'] = team1Substring;
            }

            if (team2Substring) {
                queryParams['name-or-abbreviation2'] = team2Substring;
            }

            if (minPts) {
                queryParams['min-pts'] = minPts;
            }

            if (minYear) {
                queryParams['min-year'] = minYear;
            }

            if (maxYear) {
                queryParams['max-year'] = maxYear;
            }

            console.log(`${process.env.REACT_APP_EXPRESS_APP_API_URL}/game/search`)
            const response = await axios.get(`${process.env.REACT_APP_EXPRESS_APP_API_URL}/game/search`, {
                params: queryParams,
            });
            setGameData(response.data);
            setPage(page);
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error',
                description: 'An error occurred during the search. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };


    useEffect(() => {
        handleSearch(1);
    }, []);

    const handlePrevPage = () => {
        if (page > 1) {
            handleSearch(page - 1);
        }
    };

    const handleNextPage = () => {
        handleSearch(page + 1);
    };

    return (
        <VStack spacing={6}>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <FormControl>
                    <FormLabel>Team 1</FormLabel>
                    <Input
                        value={team1Substring}
                        onChange={(e) => setTeam1Substring(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Team 2</FormLabel>
                    <Input
                        value={team2Substring}
                        onChange={(e) => setTeam2Substring(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Min Points</FormLabel>
                    <Input
                        value={minPts}
                        onChange={(e) => setMinPts(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Min Year</FormLabel>
                    <Input
                        value={minYear}
                        onChange={(e) => setMinYear(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Max Year</FormLabel>
                    <Input
                        value={maxYear}
                        onChange={(e) => setMaxYear(e.target.value)}
                    />
                </FormControl>
            </Grid>
            <Button onClick={() => handleSearch()} mt={4}>
                Search
            </Button>
            <Table mt={6} variant="simple" width="100%">
                <Thead>
                    <Tr>
                        <Th>Home Team</Th>
                        <Th>Away Team</Th>
                        <Th>Home Team Points</Th>
                        <Th>Away Team Points</Th>
                        <Th>Season Year</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {gameData &&
                        gameData.map((game) => (
                            <Tr key={game.game_id}>
                                <Td fontWeight="bold">{game.home_team_name}</Td>
                                <Td fontWeight="bold">{game.away_team_name}</Td>
                                <Td>{game.home_team_pts}</Td>
                                <Td>{game.away_team_pts}</Td>
                                <Td>{game.season_year}</Td>
                            </Tr>
                        ))}
                </Tbody>
            </Table>
            <Flex mt={6} justifyContent="space-between" width="100%">
                <Button onClick={handlePrevPage} disabled={page <= 1}>
                    Previous
                </Button>
                <Text fontWeight="bold">Page {page}</Text>
                <Button onClick={handleNextPage}>
                    Next
                </Button>
            </Flex>
            <GameCard />
        </VStack>
    );
};

export default GamePage;
