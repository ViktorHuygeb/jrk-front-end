import { useMemo, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { deleteInschrijvingById, getAll } from "../../api";
import AsyncData from "../AyncData";
import {
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
  Box,
  Select,
  Stack,
} from "@chakra-ui/react";
import { activiteit, inschrijvingType, lidType } from "../../types";
import Lid from "./Lid";

export default function LedenLijst() {
  const { data: leden = [], isLoading, error } = useSWR("lid", getAll);
  const {
    data: activiteiten = [],
    isLoading: isLoadingAct,
    error: errorAct,
  } = useSWR("activiteiten", getAll);
  const {
    data: inschrijvingen = [],
    isLoading: isLoadingIns,
    error: errorIns,
  } = useSWR("ingeschrevenleden", getAll);
  const { trigger: deleteInschrijving, error: deleteError } = useSWRMutation(
    "ingeschrevenleden",
    deleteInschrijvingById
  );

  const [filter, setFilter] = useState(-1);

  const onActiviteit = useMemo(() => filter != -1, [filter]);

  const activiteitenMetInschrijving = useMemo(() => {
    return activiteiten.filter(
      (activiteit: activiteit) => activiteit.moetInschrijven === true
    );
  }, [activiteiten]);

  const gefilterdeInschrijvingen = useMemo(() => {
    if (filter == -1) {
      return inschrijvingen;
    }
    return inschrijvingen.filter(
      (i: inschrijvingType) => i.activiteitId == filter
    );
  }, [filter, inschrijvingen]);

  const gefilterdeLeden = useMemo(() => {
    const gefilterdeIds = gefilterdeInschrijvingen.map(
      (i: inschrijvingType) => i.lidId
    );
    if (filter == -1) {
      return leden;
    }
    return leden.filter((l: lidType) => gefilterdeIds.includes(l.lidId));
  }, [filter, gefilterdeInschrijvingen]);

  const ledenRij = () => {
    if (gefilterdeLeden == 0) {
      return (
        <Tr>
          <Td colSpan={4}>Geen inschrijvingen</Td>
        </Tr>
      );
    } else {
      return gefilterdeLeden.map((lid: lidType) => {
        return (
          <Lid
            {...lid}
            key={lid.lidId}
            onActiviteit={onActiviteit}
            activiteitId={filter}
            onDelete={(lidId: number, actId: number) =>
              deleteInschrijving({ idLid: lidId, idAct: actId })
            }
          />
        );
      });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box width="200px">
        <Stack direction={"row"}>
          <Select
            data-cy="filter_input"
            onChange={(e: any) => {
              if (activiteitenMetInschrijving.length == 0) {
                setFilter(-1);
              }
              setFilter(e.target.value);
            }}
            defaultValue={-1}
          >
            <option value={-1}>Alle leden</option>
            {activiteitenMetInschrijving.map((activiteit: activiteit) => (
              <option
                key={activiteit.activiteitId}
                value={activiteit.activiteitId}
              >
                {activiteit.activiteitNaam}
              </option>
            ))}
          </Select>
        </Stack>
      </Box>
      <Box width="70%">
        <AsyncData
          loading={isLoading || isLoadingAct || isLoadingIns}
          error={error || errorAct || errorIns || deleteError}
        >
          <Table>
            <Thead>
              <Tr>
                <Th>Voornaam</Th>
                <Th>Achternaam</Th>
                <Th>Geboortedatum</Th>
                <Th>Mogen foto's</Th>
                <Th>E-mail ouders</Th>
                <Th>Telefoonnummer ouders</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody data-cy="inschrijving">{ledenRij()}</Tbody>
          </Table>
        </AsyncData>
      </Box>
    </Box>
  );
}
