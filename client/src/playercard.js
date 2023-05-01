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
            <Tbody>
              <Tr>
                <Td fontWeight="bold">Name:</Td>
                <Td>{player.display_first_last || "N/A"}</Td>
              </Tr>
              <Tr>
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
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>
    )}
  </Box>
);
        };


export default PlayerCard;
