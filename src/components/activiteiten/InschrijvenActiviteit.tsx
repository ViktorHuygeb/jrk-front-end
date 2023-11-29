import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useCallback } from "react";
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
import { lidType } from "../../types";

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

  const methods = useForm<InschrijvingenType>();

  const onSubmit: SubmitHandler<InschrijvingenType> = useCallback(
    async (data) => {
      console.log(data.ingeschrevenLidId);
      data.ingeschrevenLidId.forEach(async (lidId: number) => {
        await saveInschrijving({
          body: {
            activiteitId: activiteitId,
            lidId: parseInt(lidId.toString()),
          },
        });
      });
      methods.reset();
    },
    [methods.reset]
  );

  return (
    <Center>
      <Modal isOpen={isOpen} onClose={onClose}>
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
                              key={lid.ouderId}
                              {...methods.register("ingeschrevenLidId")}
                              value={lid.lidId}
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
            >
              Inschrijven
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
