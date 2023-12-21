import { useCallback, useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  FormProvider,
  Resolver,
} from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { save } from "../../api";
import {
  FormLabel,
  Select,
  FormControl,
  Textarea,
  Stack,
  Radio,
  RadioGroup,
  FormErrorMessage,
  Box,
} from "@chakra-ui/react";
import useSWR from "swr";
import { getAll } from "../../api";
import { activiteit as activiteitType, leidingType } from "../../types";
import Error from "../Error";
import LabelInput from "../LabelInput";

type activiteitData = {
  leidingId: string;
  activiteitNaam: string;
  datumString: string;
  beschrijving: string;
  prijsString: string;
  moetInschrijvenString: string;
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
      message: "De datum moet later dan vandaag zijn!",
    };
  }

  if (!values.beschrijving) {
    errors.beschrijving = {
      message: "Beschrijving is verplicht!",
    };
  }

  if (values.prijsString === "") {
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

export default function ActiviteitenFrom({
  currentActiviteit,
  setActiviteitToUpdate,
  onSucces,
}: {
  currentActiviteit: activiteitType | undefined;
  setActiviteitToUpdate: (activteitId: number | null) => void;
  onSucces: () => void;
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
      onSucces();
      setActiviteitToUpdate(null);
      methods.reset();
    },
    [methods.reset, saveActiviteit, currentActiviteit, onSucces]
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
      <Error error={saveError} />
      <FormProvider {...methods}>
        <Box width="95%" alignSelf={"center"}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-50 mb-3"
            id="activiteitenform"
          >
            <div className="mb-3">
              <LabelInput
                key={3}
                label="Naam activiteit"
                name="activiteitNaam"
                type="text"
                placeholder="Naam activiteit"
                data-cy="activiteit_input"
              />
            </div>

            <div className="mb-3">
              <FormLabel htmlFor="leiding" marginTop="2">
                Selecteer leiding:
              </FormLabel>
              <FormControl isInvalid={"leidingId" in methods.formState.errors}>
                <Select
                  {...methods.register("leidingId")}
                  name="leidingId"
                  placeholder="Selecteer leiding"
                  required
                  disabled={methods.formState.isSubmitting}
                  data-cy="leiding_input"
                >
                  {leiding.map(({ leidingId, voorNaam }: leidingType) => (
                    <option key={leidingId} value={leidingId}>
                      {voorNaam}
                    </option>
                  ))}
                </Select>
                {"leidingId" in methods.formState.errors && (
                  <FormErrorMessage>
                    {methods.formState.errors["leidingId"] &&
                      methods.formState.errors["leidingId"].message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </div>

            <div className="mb-3">
              <LabelInput
                key={2}
                label="Datum:"
                name="datumString"
                placeholder="Datum"
                type="date"
                data-cy="datum_input"
              />
            </div>

            <div className="mb-3">
              <FormLabel htmlFor="beschrijving" marginTop="2">
                Beschrijving:
              </FormLabel>
              <FormControl
                isInvalid={"beschrijving" in methods.formState.errors}
              >
                <Textarea
                  {...methods.register("beschrijving")}
                  id="beschrijving"
                  name="beschrijving"
                  placeholder="Voeg een beschrijving toe"
                  className="form-control"
                  disabled={methods.formState.isSubmitting}
                  data-cy="beschrijving_input"
                />
                {"beschrijving" in methods.formState.errors && (
                  <FormErrorMessage data-cy="beschrijving_error">
                    {methods.formState.errors["beschrijving"] &&
                      methods.formState.errors["beschrijving"].message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </div>
            <div className="mb-3">
              <LabelInput
                key={1}
                label="Prijs:"
                name="prijsString"
                placeholder="0"
                type="number"
                data-cy="prijs_input"
              />
            </div>

            <div className="mb-3">
              <FormLabel marginTop="2">Moet er ingeschreven worden ?</FormLabel>
              <FormControl>
                <RadioGroup defaultValue="nee" id="moetInschrijvenString">
                  <Stack direction="row" marginLeft="2">
                    <Radio
                      {...methods.register("moetInschrijvenString")}
                      value="ja"
                      disabled={methods.formState.isSubmitting}
                      data-cy="moetInschrijven_ja"
                    >
                      Ja
                    </Radio>
                    <Radio
                      {...methods.register("moetInschrijvenString")}
                      value="nee"
                      disabled={methods.formState.isSubmitting}
                      data-cy="moetInschrijven_nee"
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
          </form>
        </Box>
      </FormProvider>
    </>
  );
}
