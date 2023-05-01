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
import GameCard from './gamecard';


const GamePage = () => {
    const [gameData, setGameData] = useState(null);
    const [team1Substring, setTeam1Substring] = useState('');
    const [team2Substring, setTeam2Substring] = useState('');
    const [minPts, setMinPts] = useState('');
    const [minYear, setMinYear] = useState('');
    const [maxYear, setMaxYear] = useState('');
    const [page, setPage] = useState(1);
    const [selectedGameId, setSelectedGameId] = useState(null);
    const hoverBgColor = useColorModeValue('gray.200', 'gray.700');


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

    const handleGameClick = (gameId) => {
        console.log('Game clicked:', gameId);
        setSelectedGameId(gameId);
    };

    const handleReset = () => {
        setTeam1Substring('');
        setTeam2Substring('');
        setMinPts('');
        setMinYear('');
        setMaxYear('');
        handleSearch();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSearch();
    };

    return (
        <Flex direction="row">
        <VStack spacing={6}>
            <form onSubmit={handleSubmit}>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <FormControl>
                    <FormLabel>Home Team</FormLabel>
                    <Input
                        value={team1Substring}
                        onChange={(e) => setTeam1Substring(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Away Team</FormLabel>
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
                <Center mt={4}>
                    <Button onClick={handleReset} colorScheme="teal" mr={2}>
                        Reset
                    </Button>
                    <Button type="submit" colorScheme="teal" ml={2}>
                        Search
                    </Button>
                </Center>
            </form>
            <Table mt={6} variant="simple" width="100%">
                <Thead>
                    <Tr>
                        <Th>Home Team</Th>
                        <Th>Away Team</Th>
                        <Th>Home Score</Th>
                        <Th>Away Score</Th>
                        <Th>Game Date</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {gameData &&
                        gameData.map((game) => (
                            <Tr
                                key={game.game_id}
                                onClick={() => handleGameClick(game.game_id)}
                                cursor="pointer"
                                _hover={{ bg: hoverBgColor, transition: "all 0.2s" }}
                            >
                            <Td fontWeight="bold">{game.home_team_name}</Td>
                                <Td fontWeight="bold">{game.away_team_name}</Td>
                                <Td>{game.home_team_pts}</Td>
                                <Td>{game.away_team_pts}</Td>
                                <Td>{game.game_date.substring(0, 10)}</Td>
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
        </VStack>
            <Box p={6}>
                <GameCard gameId={selectedGameId} />
            </Box>
        </Flex>
    );
};

export default GamePage;
