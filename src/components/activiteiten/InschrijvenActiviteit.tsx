import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useCallback, useMemo } from "react";
import { getAll } from "../../api";
import { save } from "../../api";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Button,
  Checkbox,
  Stack,
  Text,
  Center,
  FormControl,
} from "@chakra-ui/react";
import { inschrijvingType, lidType } from "../../types";
import Error from "../Error";

type InschrijvingenType = {
  ingeschrevenLidId: number[];
};

export default function InschrijvenModal({
  isOpen,
  onClose,
  activiteitId,
}: {
  isOpen: boolean;
  onClose: () => void;
  activiteitId: number;
}) {
  const { trigger: saveInschrijving, error: saveError } = useSWRMutation(
    "ingeschrevenleden",
    save
  );
  const { data: leden = [], isLoading, error } = useSWR("lid", getAll);
  const { data: inschrijvingen = [] } = useSWR("ingeschrevenleden", getAll);

  const methods = useForm<InschrijvingenType>();

  const ingeschrevenLeden = useMemo(() => {
    return inschrijvingen
      .filter((i: inschrijvingType) => i.activiteitId === activiteitId)
      .map((i: inschrijvingType) => i.lidId);
  }, [inschrijvingen, activiteitId]);

  const onSubmit: SubmitHandler<InschrijvingenType> = useCallback(
    async (data) => {
      if (data.ingeschrevenLidId.length > 1) {
        data.ingeschrevenLidId.forEach(async (lidId: number) => {
          await saveInschrijving({
            body: {
              activiteitId: activiteitId,
              lidId: parseInt(lidId.toString()),
            },
          });
        });
      } else if (data.ingeschrevenLidId.length === 1) {
        await saveInschrijving({
          body: {
            activiteitId: parseInt(activiteitId.toString()),
            lidId: parseInt(data.ingeschrevenLidId.toString()),
          },
        });
      } else {
      }
      methods.reset();
    },
    [methods.reset]
  );

  return (
    <Center>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader paddingBottom="0">Inschrijven</ModalHeader>
          <ModalCloseButton />
          <ModalBody justifyItems="center">
            <Text fontSize="md">Wie wil je inschrijven?</Text>
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                id="inschrijvingsForm"
              >
                <Error error={error || saveError} />
                <FormControl>
                  <div>
                    <Stack
                      spacing={[1, 5]}
                      direction={["column", "row"]}
                      margin="3"
                    >
                      {!isLoading &&
                        leden.map((lid: lidType) => {
                          return (
                            <Checkbox
                              colorScheme="red"
                              key={lid.lidId}
                              {...methods.register("ingeschrevenLidId")}
                              value={lid.lidId}
                              defaultChecked={ingeschrevenLeden.includes(
                                lid.lidId
                              )}
                              isDisabled={ingeschrevenLeden.includes(lid.lidId)}
                              data-cy={`inschrijven_${lid.voorNaam}`}
                            >
                              {lid.voorNaam}
                            </Checkbox>
                          );
                        })}
                    </Stack>
                  </div>
                </FormControl>
              </form>
            </FormProvider>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuleer
            </Button>
            <Button
              colorScheme="red"
              type="submit"
              form="inschrijvingsForm"
              onClick={onClose}
              data-cy="bevestig_inschrijven"
            >
              Inschrijven
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
