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
    <Tr data-cy="lid">
      <Td data-cy="lid_voorNaam">{voorNaam}</Td>
      <Td data-cy="lid_familieNaam">{familieNaam}</Td>
      <Td data-cy="lid_geboortedatum">{toDateOutputString(geboortedatum)}</Td>
      <Td data-cy="lid_fotos">{magFotos ? "Ja" : "Nee"}</Td>
      <Td data-cy="lid_ouder_email">
        {ouders
          .filter((ouder: ouderType) => ouderId === ouder.ouderId)
          .map((ouder: ouderType) => ouder.email)}
      </Td>
      <Td data-cy="lid_ouder_telefoonNummer">
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
            cy_data="verwijder_inschrijving"
          />
        </Td>
      )}
    </Tr>
  );
}
