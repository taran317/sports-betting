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
    extendTheme, Center,
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
            <Center>
            <Container maxW="100%" py={12}>
                <Center>
                    <VStack>
                <Box pos="relative" display="inline-block">
                    <Heading as="h1" size="2xl" background={titleGradient} color="transparent" backgroundClip="text">
                        Basketball Betting Statistics
                    </Heading>
                </Box>
                <VStack spacing={16} align="start" width="100%">
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
                    </VStack>
                </Center>
            </Container>
            </Center>
        </ChakraProvider>
    );
};

export default HomePage;
