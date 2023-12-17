import { Center, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { Card, CardBody } from "@chakra-ui/card";
import { Box } from "@chakra-ui/react";
import { memo } from "react";

const Leiding = ({
  voorNaam,
  familieNaam,
}: {
  leidingId: number;
  voorNaam: string;
  familieNaam: string;
}) => {
  return (
    <Card maxW="sm" borderRadius="lg" margin="2" w="100%" data-cy="leiding">
      <CardBody>
        <Box
          boxSize="310px"
          height="225px"
          borderRadius="md"
          overflow="hidden"
          alignSelf="center"
          flex="1"
        >
          <Image
            src={`./src/assets/leidingFotos/${voorNaam}${familieNaam}.png`}
            boxSize="100%"
            objectFit="cover"
            objectPosition="top"
            borderRadius="lg"
            alt={`Foto van ${voorNaam} ${familieNaam}`}
          />
        </Box>
        <Heading
          textAlign="center"
          paddingTop="3"
          size="md"
          data-cy="leiding_naam"
        >{`${voorNaam} ${familieNaam}`}</Heading>
      </CardBody>
    </Card>
  );
};

export default memo(Leiding);
