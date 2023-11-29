import { lidType, ouderType } from "../../types";
import { Tr, Td } from "@chakra-ui/react";
import useSWR from "swr";
import { getAll } from "../../api";

export default function Lid({
  lidId,
  ouderId,
  geboortedatum,
  voorNaam,
  familieNaam,
}: lidType) {
  const { data: ouders = [], isLoading, error } = useSWR("ouder", getAll);

  function toDateOutputString(datum: Date) {
    datum = new Date(datum);
    return `${datum.getDate()}/${datum.getMonth() + 1}/${datum.getFullYear()}`;
  }

  return (
    <Tr>
      <Td>{voorNaam}</Td>
      <Td>{familieNaam}</Td>
      <Td>{toDateOutputString(geboortedatum)}</Td>
      <Td>
        {ouders
          .filter((ouder: ouderType) => ouderId === ouder.ouderId)
          .map((ouder: ouderType) => ouder.email)}
      </Td>
    </Tr>
  );
}
