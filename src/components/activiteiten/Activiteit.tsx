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
import FormModal from "./FormModal";
import { useAuth } from "../../contexts/Auth.context";
import LoginModal from "../LoginModal";

type activiteitType = activiteit & {
  onDelete: (activiteitId: number) => void;
  onEdit: (activteitId: number) => void;
  setActiviteitToUpdate: (actiteitId: number | null) => void;
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
  leidingId,
  activiteitNaam,
  beschrijving,
  datum,
  moetInschrijven,
  prijs,
  onDelete,
  setActiviteitToUpdate,
}: activiteitType) => {
  const { isLeiding, isAuthed } = useAuth();

  const {
    isOpen: isOpenInschrijving,
    onOpen: onOpenInschrijving,
    onClose: onCloseInschrijving,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  function inschrijvingsKnop(inschrijven: boolean) {
    if (inschrijven) {
      return (
        <>
          <Button
            colorScheme="red"
            onClick={onOpenInschrijving}
            marginRight="-2"
            data-cy="inschrijven_activiteit"
          >
            Inschrijven
          </Button>
          {isAuthed ? (
            <InschrijvenModal
              isOpen={isOpenInschrijving}
              onClose={onCloseInschrijving}
              activiteitId={activiteitId}
            />
          ) : (
            <LoginModal
              isOpen={isOpenInschrijving}
              onClose={onCloseInschrijving}
            />
          )}
        </>
      );
    }
  }

  const handleDelete = useCallback(() => {
    onDelete(activiteitId);
  }, [activiteitId, onDelete]);

  return (
    <Card
      variant="outline"
      alignItems="center"
      maxH="500px"
      borderRadius="md"
      minH="350px"
      data-cy="activiteit"
    >
      <CardHeader paddingTop="3" paddingBottom="0">
        <Stack spacing="2">
          <Box alignSelf="center">
            <Heading size="md" data-cy="activiteit_naam">
              {activiteitNaam}
            </Heading>
          </Box>
          <Box alignSelf="center">
            <Heading size="s" data-cy="activiteit_datum">
              {toDateString(datum)}
            </Heading>
          </Box>
        </Stack>
      </CardHeader>
      <CardBody padding="2" paddingLeft="4" paddingRight="4">
        <Stack divider={<StackDivider />}>
          <Box>
            <Text
              pt="2"
              fontSize="sm"
              paddingBottom="1"
              data-cy="activiteit_beschrijving"
            >
              {beschrijving}
            </Text>
          </Box>
          <Box paddingTop="0">
            <Text
              pt="2"
              fontSize="sm"
              paddingTop="0"
              data-cy="activiteit_prijs"
            >
              Deze activiteit {prijs == 0 ? "is gratis" : "kost €" + prijs}
            </Text>
          </Box>
        </Stack>
      </CardBody>
      <CardFooter>
        <Stack direction="row" spacing="2">
          {isLeiding && (
            <>
              <IconButton
                aria-label="Wijzig activiteit"
                icon={<MdEdit />}
                onClick={onOpenEdit}
                marginRight="-2"
              />
              <FormModal
                isOpen={isOpenEdit}
                onClose={onCloseEdit}
                type="Bewerk"
                setActiviteitToUpdate={setActiviteitToUpdate}
                currentActiviteit={{
                  leidingId,
                  activiteitId,
                  activiteitNaam,
                  beschrijving,
                  prijs,
                  moetInschrijven,
                  datum,
                }}
              />
            </>
          )}
          {inschrijvingsKnop(moetInschrijven)}
          {isLeiding && (
            <DeletePopover
              ariaLabel="Verwijder activiteit"
              teVerwijderen="activiteit"
              handleDelete={handleDelete}
              cy_data="verwijder_activiteit"
            />
          )}
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default memo(Activiteit);
