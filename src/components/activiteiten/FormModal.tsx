import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Button,
  Center,
} from "@chakra-ui/react";
import { activiteit } from "../../types";
import ActiviteitenFrom from "./ActiviteitenForm";

export default function FormModal({
  type,
  isOpen,
  currentActiviteit,
  onClose,
  setActiviteitToUpdate,
}: {
  type: string;
  isOpen: boolean;
  currentActiviteit: activiteit | undefined;
  onClose: () => void;
  setActiviteitToUpdate: (activiteitId: number | null) => void;
}) {
  const onSucces = () => {
    onClose();
  };

  return (
    <Center>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent maxW={"800px"} justifyContent={"center"}>
          <ModalHeader paddingBottom="0">{type} een activiteit!</ModalHeader>
          <ModalCloseButton />
          <ActiviteitenFrom
            currentActiviteit={currentActiviteit}
            setActiviteitToUpdate={setActiviteitToUpdate}
            onSucces={onSucces}
          />
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuleer
            </Button>
            <Button
              type="submit"
              colorScheme="red"
              margin="2"
              form="activiteitenform"
              data-cy="submit_activiteit"
            >
              {currentActiviteit?.activiteitId
                ? "Sla activiteit op"
                : "Voeg toe"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
