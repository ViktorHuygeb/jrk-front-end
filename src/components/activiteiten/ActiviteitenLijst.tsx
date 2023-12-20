import { useCallback, useState } from "react";
import Activiteit from "./Activiteit";
import { activiteit } from "../../types";
import { SimpleGrid, IconButton, useDisclosure, Box } from "@chakra-ui/react";
import AsyncData from "../AyncData";
import useSWR from "swr";
import { getAll, deleteById } from "../../api";
import useSWRMutation from "swr/mutation";
import { FaPlus } from "react-icons/fa";
import FormModal from "./FormModal";
import { useAuth } from "../../contexts/Auth.context";

const ActiviteitenLijst = () => {
  const { isLeiding } = useAuth();

  const {
    data: activiteiten = [],
    isLoading,
    error,
  } = useSWR("activiteiten", getAll);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  return (
    <Box className="content">
      <AsyncData
        loading={isLoading}
        error={error || (deleteError as Error | null)}
      >
        {!error ? (
          <>
            {isLeiding && (
              <>
                <IconButton
                  zIndex={1000}
                  aria-label="Maak een activiteitknop"
                  position="fixed"
                  colorScheme="red"
                  top="75px"
                  right="30px"
                  onClick={onOpen}
                  icon={<FaPlus />}
                  data-cy="maak_activiteit"
                />
                <FormModal
                  type="Maak"
                  isOpen={isOpen}
                  onClose={onClose}
                  currentActiviteit={currentActiviteit}
                  setActiviteitToUpdate={setActiviteitToUpdate}
                />
              </>
            )}
            <SimpleGrid
              justifyContent={"center"}
              spacing={3}
              templateColumns="repeat(auto-fit, minmax(250px, 300px))"
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
                    setActiviteitToUpdate={setActiviteitToUpdate}
                    {...activiteit}
                    onDelete={(activiteitId: number) =>
                      deleteActiviteit({ id: activiteitId })
                    }
                    onEdit={setActiviteitToUpdate}
                  />
                ))}
            </SimpleGrid>
          </>
        ) : null}
      </AsyncData>
    </Box>
  );
};

export default ActiviteitenLijst;
