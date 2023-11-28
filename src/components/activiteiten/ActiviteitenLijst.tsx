import { useCallback, useState } from "react";
import Activiteit from "./Activiteit";
import ActiviteitenForm from "./ActiviteitenForm";
import { SimpleGrid } from "@chakra-ui/react";
import AsyncData from "../AyncData";
import useSWR from "swr";
import { getAll, deleteById } from "../../api";
import useSWRMutation from "swr/mutation";

type activiteit = {
  activiteitId: number;
  leidingId: number;
  activiteitNaam: string;
  datum: Date;
  beschrijving: string;
  prijs: number;
  moetInschrijven: boolean;
};

const ActiviteitenLijst = () => {
  const {
    data: activiteiten = [],
    isLoading,
    error,
  } = useSWR("activiteiten", getAll);

  const [currentActiviteit, setCurrentActiviteit] = useState<
    activiteit | undefined
  >(undefined);

  const setActiviteitToUpdate = useCallback(
    (id: number | null) => {
      setCurrentActiviteit(
        id === null
          ? {}
          : activiteiten.find((a: activiteit) => a.activiteitId === id)
      );
    },
    [activiteiten]
  );

  const { trigger: deleteActiviteit, error: deleteError } = useSWRMutation(
    "activiteiten",
    deleteById
  );

  type FormData = {
    naam: string;
    datum: Date;
    beschrijving: string;
    prijs: number;
  };

  // const createActiviteit = useCallback(
  //   (data: FormData) => {
  //     console.log(activiteiten);
  //     const { naam, beschrijving, prijs, datum } = data;
  //     const newActiviteiten = [
  //       {
  //         naam,
  //         beschrijving,
  //         prijs,
  //         datum: toDateString(datum),
  //         id: Math.floor(Math.random() * 100) + 2,
  //       },
  //       ...activiteiten,
  //     ];
  //     console.log(newActiviteiten);
  //     setActiviteiten(newActiviteiten);
  //   },
  //   [activiteiten]
  // );

  return (
    <>
      <AsyncData
        loading={isLoading}
        error={error || (deleteError as Error | null)}
      >
        {!error ? (
          <SimpleGrid
            spacing={3}
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            padding="20px"
          >
            {activiteiten
              .sort(
                (a1: activiteit, a2: activiteit) =>
                  new Date(a1.datum).getTime() - new Date(a2.datum).getTime()
              )
              .map((activiteit: activiteit) => (
                <Activiteit
                  key={activiteit.activiteitId}
                  {...activiteit}
                  onDelete={(activiteitId: number) =>
                    deleteActiviteit({ id: activiteitId })
                  }
                  onEdit={setActiviteitToUpdate}
                />
              ))}
          </SimpleGrid>
        ) : null}
      </AsyncData>

      <ActiviteitenForm
        setActiviteitToUpdate={setActiviteitToUpdate}
        currentActiviteit={currentActiviteit}
      />
    </>
  );
};

export default ActiviteitenLijst;
