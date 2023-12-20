import { useFormContext } from "react-hook-form";
import {
  FormLabel,
  Input,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";

type labelInputProps = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  rest?: any[];
};

export default function LabelInput({
  label,
  name,
  type,
  placeholder,
  ...rest
}: labelInputProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const hasError = name in errors;
  return (
    <>
      <div className="mb-3">
        <FormLabel marginTop="2" htmlFor={name}>
          {label}
        </FormLabel>
        <FormControl isInvalid={hasError}>
          <Input
            {...register(name)}
            id={name}
            type={type}
            placeholder={placeholder}
            {...rest}
            disabled={isSubmitting}
          />
          {hasError && (
            <FormErrorMessage data-cy={`${name}_error`}>
              {errors[name]?.message && errors[name]?.message?.toString()}
            </FormErrorMessage>
          )}
        </FormControl>
      </div>
    </>
  );
}
