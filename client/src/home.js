import React from 'react';
import {
    Box,
    Heading,
    Button,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Container,
    VStack,
    useColorModeValue,
    extendTheme,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeScript } from '@chakra-ui/color-mode';
import GamePage from './game';

const theme = extendTheme({
    colors: {
        primary: {
            500: '#4FD1C5', // Teal
            300: '#81E6D9', // Light teal
        },
        secondary: {
            500: '#4299E1', // Blue
        },
    },
});

const HomePage = () => {
    const headingColor = useColorModeValue('gray.700', 'white');
    const buttonColor = 'primary.500';
    const bgColor = 'primary.300';
    const titleGradient = 'linear-gradient(90deg, #4FD1C5 0%, #4299E1 100%)';

    return (
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode="light" />
            <Container maxW="80%" py={12}>
                <Box pos="relative" display="inline-block">
                    <Heading as="h1" size="2xl" background={titleGradient} color="transparent" backgroundClip="text">
                        Sports Statistics
                    </Heading>
                </Box>
                <VStack spacing={16} align="start">
                    <Tabs mt={4}>
                        <TabList>
                            <Tab>Game</Tab>
                            <Tab>Player</Tab>
                            <Tab>Team</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <GamePage />
                            </TabPanel>
                            <TabPanel>
                                <Button
                                    mt={2}
                                    colorScheme={buttonColor}
                                    as={RouterLink}
                                    to="/player"
                                >
                                    Explore Players
                                </Button>
                            </TabPanel>
                            <TabPanel>
                                <Button
                                    mt={2}
                                    colorScheme={buttonColor}
                                    as={RouterLink}
                                    to="/team"
                                >
                                    Explore Teams
                                </Button>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </VStack>
            </Container>
        </ChakraProvider>
    );
};

export default HomePage;
