import { lidType, ouderType } from "../../types";
import { Tr, Td } from "@chakra-ui/react";
import DeletePopover from "../deletePopover";
import useSWR from "swr";
import { getAll } from "../../api";
import { useCallback } from "react";

type lidProps = lidType & {
  onActiviteit: boolean;
  activiteitId: number;
  onDelete: any;
};

export default function Lid({
  lidId,
  ouderId,
  geboortedatum,
  magFotos,
  voorNaam,
  familieNaam,
  onActiviteit,
  activiteitId,
  onDelete,
}: lidProps) {
  const { data: ouders = [], isLoading, error } = useSWR("ouder", getAll);

  function toDateOutputString(datum: Date) {
    datum = new Date(datum);
    return `${datum.getDate()}/${datum.getMonth() + 1}/${datum.getFullYear()}`;
  }

  const handleDelete = useCallback(() => {
    onDelete(lidId, activiteitId);
  }, [lidId, activiteitId, onDelete]);

  return (
    <Tr>
      <Td>{voorNaam}</Td>
      <Td>{familieNaam}</Td>
      <Td>{toDateOutputString(geboortedatum)}</Td>
      <Td>{magFotos ? "Ja" : "Nee"}</Td>
      <Td>
        {ouders
          .filter((ouder: ouderType) => ouderId === ouder.ouderId)
          .map((ouder: ouderType) => ouder.email)}
      </Td>
      <Td>
        {ouders
          .filter((ouder: ouderType) => ouderId === ouder.ouderId)
          .map((ouder: ouderType) => ouder.telefoonNummer)}
      </Td>
      {onActiviteit && (
        <Td>
          <DeletePopover
            teVerwijderen="inschrijving"
            ariaLabel="Verwijder inschrijving"
            handleDelete={handleDelete}
          />
        </Td>
      )}
    </Tr>
  );
}
