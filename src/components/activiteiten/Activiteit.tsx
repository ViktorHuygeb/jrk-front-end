import { memo, useCallback } from "react";
import { MdEdit } from "react-icons/md";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/card";
import {
  Stack,
  StackDivider,
  Box,
  Heading,
  Text,
  Button,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import InschrijvenModal from "./InschrijvenActiviteit";
import DeletePopover from "../deletePopover";
import { activiteit } from "../../types";

type activiteitType = activiteit & {
  onDelete: (activiteitId: number) => void;
  onEdit: (activteitId: number) => void;
};

const toDateString = (date: Date) => {
  let besteDatumString: string = "";
  let datumString: string = new Date(date).toISOString();
  let datumStringZonderTijd: string = datumString.substring(
    0,
    datumString.indexOf("T")
  );
  let tokens = datumStringZonderTijd.split("-");
  for (let token in tokens.reverse()) {
    let datumValue = tokens[token];
    if (token === "1") {
      datumValue = omzettenNaarMaand(datumValue);
    }
    besteDatumString += datumValue + " ";
  }
  return besteDatumString;
};

const omzettenNaarMaand = (monthNumber: string) => {
  let monthName: string;
  switch (monthNumber) {
    case "01":
      monthName = "Januari";
      break;
    case "02":
      monthName = "Februari";
      break;
    case "03":
      monthName = "Maart";
      break;
    case "04":
      monthName = "April";
      break;
    case "05":
      monthName = "Mei";
      break;
    case "006":
      monthName = "Juni";
      break;
    case "07":
      monthName = "Juli";
      break;
    case "08":
      monthName = "Augustus";
      break;
    case "09":
      monthName = "September";
      break;
    case "10":
      monthName = "Oktober";
      break;
    case "11":
      monthName = "November";
      break;
    case "12":
      monthName = "December";
      break;
    default:
      monthName = "Ongeldige maand";
  }
  return monthName;
};

const Activiteit = ({
  activiteitId,
  activiteitNaam,
  beschrijving,
  datum,
  moetInschrijven,
  prijs,
  onDelete,
  onEdit,
}: activiteitType) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  function inschrijvingsKnop(inschrijven: boolean) {
    if (inschrijven) {
      return (
        <>
          <Button colorScheme="red" onClick={onOpen} marginRight="-2">
            Inschrijven
          </Button>
          <InschrijvenModal
            isOpen={isOpen}
            onClose={onClose}
            activiteitId={activiteitId}
          />
        </>
      );
    }
  }

  const handleDelete = useCallback(() => {
    onDelete(activiteitId);
  }, [activiteitId, onDelete]);

  const handleEdit = useCallback(() => {
    onEdit(activiteitId);
  }, [activiteitId, onEdit]);

  return (
    <Card variant="outline" alignItems="center" maxH="500px" borderRadius="md">
      <CardHeader paddingTop="3" paddingBottom="0">
        <Stack spacing="2">
          <Box alignSelf="center">
            <Heading size="md">{activiteitNaam}</Heading>
          </Box>
          <Box alignSelf="center">
            <Heading size="s">{toDateString(datum)}</Heading>
          </Box>
        </Stack>
      </CardHeader>
      <CardBody padding="2" paddingLeft="4" paddingRight="4">
        <Stack divider={<StackDivider />}>
          <Box>
            <Text pt="2" fontSize="sm" paddingBottom="1">
              {beschrijving}
            </Text>
          </Box>
          <Box paddingTop="0">
            <Text pt="2" fontSize="sm" paddingTop="0">
              Deze activiteit {prijs == 0 ? "is gratis" : "kost €" + prijs}
            </Text>
          </Box>
        </Stack>
      </CardBody>
      <CardFooter>
        <Stack direction="row" spacing="2">
          <IconButton
            aria-label="Wijzig activiteit"
            icon={<MdEdit />}
            onClick={handleEdit}
          />
          {inschrijvingsKnop(moetInschrijven)}
          <DeletePopover
            ariaLabel="Verwijder activiteit"
            teVerwijderen="activiteit"
            handleDelete={handleDelete}
          />
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default memo(Activiteit);
