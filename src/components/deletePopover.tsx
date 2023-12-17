import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  FocusLock,
  useDisclosure,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

export default function DeletePopover({
  teVerwijderen,
  handleDelete,
  ariaLabel,
  cy_data,
}: {
  teVerwijderen: string;
  handleDelete: () => void;
  ariaLabel: string;
  cy_data: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="right"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <IconButton
          aria-label={ariaLabel}
          icon={<MdDelete />}
          data-cy={cy_data}
        />
      </PopoverTrigger>
      <PopoverContent>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          <PopoverCloseButton />
          <Text fontSize="md" margin="4" marginBottom="0">
            Ben je zeker dat je de {teVerwijderen} wil verwijderen ?
          </Text>
          <Button onClick={onClose} margin="4">
            Nee
          </Button>
          <Button
            onClick={handleDelete}
            margin="4"
            marginLeft="0"
            colorScheme="red"
            data-cy="bevestig_verwijderen"
          >
            Ja
          </Button>
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
}
