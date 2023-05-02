import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import axios from "axios";

const PlayerCard = ({ player }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("gray.100", "gray.900");

return (
  <Box>
    {player && (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        w="100%"
        backgroundColor={cardBg}
      >
        <Box w="100%">
          <Text fontSize="xl" fontWeight="bold">
            Player Information
          </Text>
          <Table variant="simple">
          <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Height</Th>
                                    <Th>Weight</Th>
                                    <Th>Career Span</Th>
                                    <Th>Jersey</Th>
                                    <Th>School</Th>
                                    <Th>Country</Th>
                                </Tr>
                            </Thead>
            <Tbody>
              <Tr>
                <Td>{player.display_first_last || "N/A"}</Td>
                <Td>
                  {player.height_feet && player.height_inches
                    ? player.height_feet + "'" + player.height_inches + '"'
                    : "N/A"}
                </Td>
                <Td>{player.weight ? player.weight + " lbs" : "N/A"}</Td>
                <Td>
                  {player.from_year && player.to_year
                    ? player.from_year + "-" + player.to_year
                    : "N/A"}
                </Td>
                <Td>{player.jersey || "N/A"}</Td>
                <Td>{player.school || "N/A"}</Td>
                <Td>{player.country || "N/A"}</Td>
              </Tr>
              {/* <Tr>
                <Td fontWeight="bold">Points per Game:</Td>
                <Td>{player.pts ? player.pts.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Assists per Game:</Td>
                <Td>{player.ast ? player.ast.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Total Rebounds per Game:</Td>
                <Td>{player.reb ? player.reb.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Playing Career:</Td>
                <Td>
                  {player.from_year && player.to_year
                    ? player.from_year + "-" + player.to_year
                    : "N/A"}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Field Goal Percentage:</Td>
                <Td>
                  {player.fga && player.fgm
                    ? ((player.fgm / player.fga) * 100).toFixed(1) + "%"
                    : "N/A"}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Three-Point Percentage:</Td>
                <Td>
                  {player.fg3m && player.fg3a
                    ? ((player.fg3m / player.fg3a) * 100).toFixed(1) + "%"
                    : "N/A"}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Free Throw Percentage:</Td>
                <Td>
                  {player.ft_pct
                    ? (player.ft_pct * 100).toFixed(1) + "%"
                    : "N/A"}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Height:</Td>
                <Td>
                  {player.height_feet && player.height_inches
                    ? player.height_feet + "'" + player.height_inches + '"'
                    : "N/A"}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Weight:</Td>
                <Td>{player.weight ? player.weight + " lbs" : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Draft Year:</Td>
                <Td>{player.draft_year || "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Jersey:</Td>
                <Td>{player.jersey || "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">School:</Td>
                <Td>{player.school || "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Country:</Td>
                <Td>{player.country || "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Field Goals Made:</Td>
                <Td>{player.fgm ? player.fgm.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Field Goals Attempted:</Td>
                <Td>{player.fga ? player.fga.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Three-Pointers Made:</Td>
                <Td>{player.fg3m ? player.fg3m.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Three-Pointers Attempted:</Td>
                <Td>{player.fg3a ? player.fg3a.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Free Throws Made:</Td>
                <Td>{player.ftm ? player.ftm.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Offensive Rebounds:</Td>
                <Td>{player.oreb ? player.oreb.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Defensive Rebounds:</Td>
                <Td>{player.dreb ? player.dreb.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Total Rebounds:</Td>
                <Td>{player.reb ? player.reb.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Assists:</Td>
                <Td>{player.ast ? player.ast.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Steals:</Td>
                <Td>{player.stl ? player.stl.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Blocks:</Td>
                <Td>{player.blk ? player.blk.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Turnovers:</Td>
                <Td>{player.tov ? player.tov.toFixed(2) : "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Personal Fouls:</Td>
                <Td>{player.pf ? player.pf.toFixed(2) : "N/A"}</Td>
              </Tr> */}
            </Tbody>
          </Table>
        </Box>

        <Box w="100%">
          <Text fontSize="xl" fontWeight="bold">
            Counting Averages
          </Text>
          <Table variant="simple">
          <Thead>
                                <Tr>
                                    <Th>PTS</Th>
                                    <Th>AST</Th>
                                    <Th>RBD</Th>
                                    <Th>STL</Th>
                                    <Th>BLK</Th>
                                    <Th>MIN</Th>
                                    <Th>TOV</Th>
                                    <Th>PF</Th>
                                </Tr>
                            </Thead>
            <Tbody>
              <Tr>
                <Td>{player.pts ? player.pts.toFixed(2) : "N/A"}</Td>
                <Td>{player.ast ? player.ast.toFixed(2) : "N/A"}</Td>
                <Td>{player.reb ? player.reb.toFixed(2) : "N/A"}</Td>
                <Td>{player.stl ? player.stl.toFixed(2) : "N/A"}</Td>
                <Td>{player.blk ? player.blk.toFixed(2) : "N/A"}</Td>
                <Td>{player.min ? player.min.toFixed(2) : "N/A"}</Td>
                <Td>{player.tov ? player.tov.toFixed(2) : "N/A"}</Td>
                <Td>{player.pf ? player.pf.toFixed(2) : "N/A"}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
        <Box w="100%">
          <Text fontSize="xl" fontWeight="bold">
            Shooting Averages
          </Text>
          <Table variant="simple">
          <Thead>
                                <Tr>
                                    <Th>FG</Th>
                                    <Th>FG%</Th>
                                    <Th>FT</Th>
                                    <Th>FT%</Th>
                                    <Th>3P</Th>
                                    <Th>3P%</Th>
                                </Tr>
                            </Thead>
            <Tbody>
              <Tr>
                <Td>{`${player.fgm ? player.fgm.toFixed(1) : "N/A"} / ${player.fga ? player.fga.toFixed(1) : "N/A"}`}</Td>
                <Td>{player.fga && player.fgm
                    ? ((player.fgm / player.fga) * 100).toFixed(1) + "%"
                    : "N/A"}</Td>
                    <Td>{`${player.ftm ? player.ftm.toFixed(1) : "N/A"} / ${player.fta ? player.fta.toFixed(1) : "N/A"}`}</Td>
                <Td>{player.fta && player.ftm
                    ? ((player.ftm / player.fta) * 100).toFixed(1) + "%"
                    : "N/A"}</Td>
                    <Td>{`${player.fg3m ? player.fg3m.toFixed(1) : "N/A"} / ${player.fg3a ? player.fg3a.toFixed(1) : "N/A"}`}</Td>
                  <Td>{player.fg3a && player.fg3m
                    ? ((player.fg3m / player.fg3a) * 100).toFixed(1) + "%"
                    : "N/A"}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
        {/* <Box w="100%">
          <Text fontSize="xl" fontWeight="bold">
            Advanced Betting Stats
          </Text>
          <Table variant="simple">
          <Thead>
                                <Tr>
                                    <Th>Underdog Games</Th>
                                    <Th>Underdog Money</Th>
                                    <Th>Underdog Money Per Game</Th>
                                </Tr>
                            </Thead>
            <Tbody>
              <Tr>
                <Td>{playerUnderdog.total_games}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box> */}
      </Box>
    )}
  </Box>
);
        };


export default PlayerCard;
