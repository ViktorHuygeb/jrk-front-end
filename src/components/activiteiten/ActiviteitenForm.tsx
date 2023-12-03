import { useCallback, useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  FormProvider,
  useFormContext,
  Resolver,
} from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { save } from "../../api";
import {
  Button,
  FormLabel,
  Input,
  Select,
  FormControl,
  Textarea,
  Stack,
  Radio,
  RadioGroup,
  FormErrorMessage,
  Text,
  Box,
} from "@chakra-ui/react";
import useSWR from "swr";
import { getAll } from "../../api";
import { activiteit as activiteitType, leidingType } from "../../types";
import Error from "../Error";

type activiteitData = {
  leidingId: string;
  activiteitNaam: string;
  datumString: string;
  beschrijving: string;
  prijsString: string;
  moetInschrijvenString: string;
};

type labelInputProps = {
  label: string;
  name: string;
  type: string;
  rest?: any;
};

const resolver: Resolver<activiteitData> = async (values) => {
  const errors: Record<string, Record<string, unknown>> = {};

  if (!values.activiteitNaam) {
    errors.activiteitNaam = {
      message: "Activiteitnaam is verplicht!",
    };
  } else if (values.activiteitNaam.length < 2) {
    errors.activiteitNaam = {
      message: "De naam moet minstens 2 tekens lang zijn!",
    };
  }

  if (!values.leidingId) {
    errors.leiding = {
      message: "Leiding is verplicht!",
    };
  }

  if (!values.datumString) {
    errors.datumString = {
      message: "Datum is verplicht!",
    };
  } else if (new Date(values.datumString) < new Date(Date())) {
    errors.datumString = {
      message: "De datumString moet later dan vandaag zijn !",
    };
  }
  if (!values.beschrijving) {
    errors.beschrijving = {
      message: "Beschrijving is verplicht!",
    };
  }

  if (values.prijsString === undefined || values.prijsString === null) {
    errors.prijsString = {
      messsage: "Prijs is verplicht! Geef 0 in indien gratis!",
    };
  } else if (
    parseFloat(values.prijsString) < 0 ||
    parseFloat(values.prijsString) > 50
  ) {
    errors.prijsString = {
      message: "De prijs moet tussen 0 en 50 euro liggen !",
    };
  } else if (parseFloat(values.prijsString) > 50) {
    errors.prijsstring = {
      max: { value: 50, message: "Maximum 50" },
    };
  }

  return {
    values: Object.keys(values).length > 0 ? values : {},
    errors: Object.keys(errors).length > 0 ? errors : {},
  };
};

const toDateInputString = (date: any) => {
  if (!date) return null;
  date = new Date(date);
  let asString = date.toISOString();
  return asString.substring(0, asString.indexOf("T"));
};

function LabelInput({ label, name, type, ...rest }: labelInputProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const hasError = name in errors;
  return (
    <>
      <div className="mb-3">
        <FormLabel htmlFor={name} marginTop="2" marginLeft="2">
          {label}
        </FormLabel>
        <FormControl isInvalid={hasError}>
          <Input
            {...register(name)}
            id={name}
            type={type}
            placeholder={name}
            {...rest}
            disabled={isSubmitting}
            marginLeft="2"
          />
          {hasError && (
            <FormErrorMessage paddingLeft="2">
              {errors[name]?.message && errors[name]?.message?.toString()}
            </FormErrorMessage>
          )}
        </FormControl>
      </div>
    </>
  );
}

export default function ActiviteitenFrom({
  currentActiviteit,
  setActiviteitToUpdate,
}: {
  currentActiviteit: activiteitType | undefined;
  setActiviteitToUpdate: (activteitId: number | null) => void;
}) {
  const { trigger: saveActiviteit, error: saveError } = useSWRMutation(
    "activiteiten",
    save
  );
  const { data: leiding = [] } = useSWR("leiding", getAll);

  const methods = useForm<activiteitData>({ resolver });

  const onSubmit: SubmitHandler<activiteitData> = useCallback(
    async (data) => {
      const {
        leidingId,
        activiteitNaam,
        datumString,
        beschrijving,
        prijsString,
        moetInschrijvenString,
      } = data;
      const moetInschrijven = moetInschrijvenString === "ja" ? true : false;
      await saveActiviteit({
        id: currentActiviteit?.activiteitId,
        body: {
          activiteitId: currentActiviteit?.activiteitId,
          leidingId: parseInt(leidingId),
          activiteitNaam: activiteitNaam,
          datum: new Date(datumString),
          beschrijving: beschrijving,
          prijs: parseInt(prijsString),
          moetInschrijven: moetInschrijven,
        },
      });
      setActiviteitToUpdate(null);
      methods.reset();
    },
    [methods.reset, saveActiviteit, currentActiviteit]
  );

  useEffect(() => {
    if (
      currentActiviteit &&
      (Object.keys(currentActiviteit).length !== 0 ||
        currentActiviteit.constructor !== Object)
    ) {
      const dateAsString = toDateInputString(
        new Date(currentActiviteit?.datum)
      );
      methods.setValue(
        "activiteitNaam",
        currentActiviteit?.activiteitNaam ?? ""
      );
      methods.setValue("beschrijving", currentActiviteit?.beschrijving ?? "");
      methods.setValue(
        "leidingId",
        currentActiviteit?.leidingId.toString() ?? ""
      );
      methods.setValue("datumString", dateAsString);
      methods.setValue(
        "moetInschrijvenString",
        currentActiviteit?.moetInschrijven == true ? "ja" : "nee" ?? "nee"
      );
      methods.setValue(
        "prijsString",
        currentActiviteit?.prijs.toString() ?? ""
      );
    } else {
      methods.reset();
    }
  }, [currentActiviteit, methods.setValue, methods.reset]);

  return (
    <>
      <Text fontSize="3xl" marginLeft="2" paddingBottom="0">
        Maak een activiteit !
      </Text>
      <Error error={saveError} />
      <FormProvider {...methods}>
        <Box width="50%">
          <form onSubmit={methods.handleSubmit(onSubmit)} className="w-50 mb-3">
            <div className="mb-3">
              <LabelInput
                label="Naam activiteit"
                name="activiteitNaam"
                type="text"
              />
            </div>

            <div className="mb-3">
              <FormLabel htmlFor="leiding" marginLeft="2" marginTop="2">
                Selecteer leiding:
              </FormLabel>
              <FormControl>
                <Select
                  {...methods.register("leidingId")}
                  name="leidingId"
                  placeholder="Selecteer leiding"
                  required
                  disabled={methods.formState.isSubmitting}
                  marginLeft="2"
                  as="select"
                >
                  {leiding.map(({ leidingId, voorNaam }: leidingType) => (
                    <option key={leidingId} value={leidingId}>
                      {voorNaam}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage paddingLeft="2">
                  {methods.formState.errors["leidingId"] &&
                    methods.formState.errors["leidingId"].message}
                </FormErrorMessage>
              </FormControl>
            </div>

            <div className="mb-3">
              <LabelInput label="Datum:" name="datumString" type="date" />
            </div>

            <div className="mb-3">
              <FormLabel htmlFor="beschrijving" marginLeft="2" marginTop="2">
                Beschrijving:
              </FormLabel>
              <FormControl>
                <Textarea
                  {...methods.register("beschrijving")}
                  id="beschrijving"
                  placeholder="Voeg een beschrijving toe"
                  className="form-control"
                  disabled={methods.formState.isSubmitting}
                  marginLeft="2"
                />
                <FormErrorMessage paddingLeft="2">
                  {methods.formState.errors["beschrijving"] &&
                    methods.formState.errors["beschrijving"].message}
                </FormErrorMessage>
              </FormControl>
            </div>
            <div className="mb-3">
              <LabelInput label="Prijs:" name="prijsString" type="number" />
            </div>

            <div className="mb-3">
              <FormLabel marginLeft="2">
                Moet er ingeschreven worden ?
              </FormLabel>
              <FormControl>
                <RadioGroup defaultValue="nee" id="moetInschrijvenString">
                  <Stack direction="row" marginLeft="2">
                    <Radio
                      {...methods.register("moetInschrijvenString")}
                      value="ja"
                      disabled={methods.formState.isSubmitting}
                    >
                      Ja
                    </Radio>
                    <Radio
                      {...methods.register("moetInschrijvenString")}
                      value="nee"
                      disabled={methods.formState.isSubmitting}
                    >
                      Nee
                    </Radio>
                  </Stack>
                </RadioGroup>
                <FormErrorMessage paddingLeft="2">
                  {methods.formState.errors["moetInschrijvenString"] &&
                    methods.formState.errors["moetInschrijvenString"].message}
                </FormErrorMessage>
              </FormControl>
            </div>
            <Button
              type="submit"
              colorScheme="red"
              isDisabled={methods.formState.isSubmitting}
              margin="2"
            >
              {currentActiviteit?.activiteitId
                ? "Sla activiteit op"
                : "Voeg toe"}
            </Button>
          </form>
        </Box>
      </FormProvider>
    </>
  );
}
