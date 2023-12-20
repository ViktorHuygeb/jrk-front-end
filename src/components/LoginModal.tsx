import {
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function InschrijvenModal({
  isOpen,
  onClose,
  activiteitId,
}: {
  isOpen: boolean;
  onClose: () => void;
  activiteitId: number;
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ pathname: "/login" });
  };

  return (
    <Center>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader paddingBottom="0">Log in</ModalHeader>
          <ModalCloseButton />
          <ModalBody justifyItems="center">
            <p>Log je in om leden in te schrijven!</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuleer
            </Button>
            <Button colorScheme="red" onClick={handleClick}>
              Log in
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
