import { useMemo, useCallback, useState } from "react";
import useSWR from "swr";
import { getAll } from "../../api";
import AsyncData from "../AyncData";
import { Table, Thead, Tr, Th, Tbody, Box, Select } from "@chakra-ui/react";
import { activiteit, inschrijvingType, lidType } from "../../types";
import Lid from "./Lid";

export default function LedenLijst() {
  const { data: leden = [], isLoading, error } = useSWR("lid", getAll);
  const { data: activiteiten = [] } = useSWR("activiteiten", getAll);
  const { data: inschrijvingen = [] } = useSWR("ingeschrevenleden", getAll);

  const [filter, setFilter] = useState();

  const gefilterdeLeden = useMemo(() => {
    const gefilterdeInschrijvingen = inschrijvingen.filter(
      (i: inschrijvingType) => i.activiteitId === filter
    );
    return leden.filter((l: lidType) => {
      return gefilterdeInschrijvingen
        .map((i: inschrijvingType) => i.lidId)
        .includes(l.lidId);
    });
  }, [filter, leden, inschrijvingen]);

  return (
    <>
      <Box marginLeft="2" width="150px">
        <Select
          placeholder="Alle leden"
          onChange={(e: any) => {
            setFilter(e.target.value);
          }}
        >
          {activiteiten
            .filter(
              (activiteit: activiteit) => activiteit.moetInschrijven === true
            )
            .map((activiteit: activiteit) => (
              <option
                key={activiteit.activiteitId}
                value={activiteit.activiteitId}
              >
                {activiteit.activiteitNaam}
              </option>
            ))}
        </Select>
      </Box>
      <Box width="65%">
        <AsyncData loading={isLoading} error={error}>
          <Table>
            <Thead>
              <Tr>
                <Th>Voornaam</Th>
                <Th>Achternaam</Th>
                <Th>Geboortedatum</Th>
                <Th>E-mail ouders</Th>
              </Tr>
            </Thead>
            <Tbody>
              {gefilterdeLeden.map((lid: lidType) => {
                return <Lid {...lid} key={lid.lidId} />;
              })}
            </Tbody>
          </Table>
        </AsyncData>
      </Box>
    </>
  );
}
