import React from 'react';
import {
    Box,
    Heading,
    Button,
    SimpleGrid,
    Container,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const HomePage = () => {
    const headingColor = useColorModeValue('gray.700', 'white');
    const buttonColor = useColorModeValue('teal', 'teal.300');

    return (
        <Container maxW="container.xl" py={12}>
            <VStack spacing={8}>
                <Heading as="h1" size="2xl" color={headingColor}>
                    Sports Statistics
                </Heading>
                <SimpleGrid columns={[1, 2, 3]} spacing={10}>
                    <Box>
                        <Heading as="h2" size="lg" color={headingColor}>
                            Game
                        </Heading>
                        <Button
                            mt={2}
                            colorScheme={buttonColor}
                            as={RouterLink}
                            to="/game"
                        >
                            Explore Games
                        </Button>
                    </Box>
                    <Box>
                        <Heading as="h2" size="lg" color={headingColor}>
                            Player
                        </Heading>
                        <Button
                            mt={2}
                            colorScheme={buttonColor}
                            as={RouterLink}
                            to="/player"
                        >
                            Explore Players
                        </Button>
                    </Box>
                    <Box>
                        <Heading as="h2" size="lg" color={headingColor}>
                            Team
                        </Heading>
                        <Button
                            mt={2}
                            colorScheme={buttonColor}
                            as={RouterLink}
                            to="/team"
                        >
                            Explore Teams
                        </Button>
                    </Box>
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default HomePage;
