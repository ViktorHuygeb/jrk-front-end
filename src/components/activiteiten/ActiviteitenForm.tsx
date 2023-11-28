import { memo, useCallback, useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  Controller,
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
} from "@chakra-ui/react";
import useSWR from "swr";
import { getAll } from "../../api";

type activiteitData = {
  leidingId: string;
  activiteitNaam: string;
  datumString: string;
  beschrijving: string;
  prijsString: string;
  moetInschrijvenString: string;
};

type activiteitType = {
  activiteitId: number;
  leidingId: number;
  activiteitNaam: string;
  datum: Date;
  beschrijving: string;
  prijs: number;
  moetInschrijven: boolean;
};

type leidingType = {
  leidingId: number;
  voorNaam: string;
  familieNaam: string;
  email: string;
  straat: string;
  huisnummer: number;
  postcode: number;
  stad: string;
  geboortedatum: Date;
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
      required: "Activiteitnaam is verplicht!",
      minLength: {
        value: 2,
        message: "De naam moet minstens 2 tekens lang zijn!",
      },
    };
  }

  if (!values.leidingId) {
    errors.leiding = {
      required: "Leiding is verplicht!",
    };
  }

  if (!values.datumString) {
    errors.datumString = {
      required: "Datum is verplicht!",
    };
  }
  // } else if (new Date(values.datumString) < new Date(Date())) {
  //   errors.datumString = {
  //     min: { message: "De datumString moet later dan vandaag zijn !" },
  //   };
  // }
  if (!values.beschrijving) {
    errors.beschrijving = {
      required: "Beschrijving is verplicht!",
    };
  }

  if (values.prijsString === undefined || values.prijsString === null) {
    errors.prijsString = {
      required: "Prijs is verplicht! Geef 0 in indien gratis!",
    };
  } else if (parseFloat(values.prijsString) < 0) {
    errors.prijsString = {
      min: { value: 0, message: "Minimum 0" },
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
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <FormControl isInvalid={hasError}>
          <Input
            {...register(name)}
            id={name}
            type={type}
            placeholder={name}
            {...rest}
            disabled={isSubmitting}
          />
          {hasError && (
            <FormErrorMessage>
              {/* {errors[name]?.message && errors[name]?.message} */}
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
      console.log(currentActiviteit);
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
      <h1>Voeg een activiteit toe:</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="w-50 mb-3">
          <div className="mb-3">
            <LabelInput
              label="Naam activiteit"
              name="activiteitNaam"
              type="text"
            />
          </div>

          <div className="mb-3">
            <FormLabel htmlFor="leiding">Selecteer leiding:</FormLabel>
            <FormControl>
              <Controller
                {...methods.register("leidingId")}
                name="leidingId"
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Selecteer leiding"
                    required
                    disabled={methods.formState.isSubmitting}
                  >
                    {leiding.map(({ leidingId, voorNaam }: leidingType) => (
                      <option key={leidingId} value={leidingId}>
                        {voorNaam}
                      </option>
                    ))}
                  </Select>
                )}
              />
              <FormErrorMessage>
                {methods.formState.errors["leidingId"] &&
                  methods.formState.errors["leidingId"].message}
              </FormErrorMessage>
            </FormControl>
          </div>

          <div className="mb-3">
            <LabelInput label="Datum:" name="datumString" type="date" />
          </div>

          <div className="mb-3">
            <FormLabel htmlFor="beschrijving">Beschrijving:</FormLabel>
            <FormControl>
              <Textarea
                {...methods.register("beschrijving")}
                id="beschrijving"
                placeholder="Voeg een beschrijving toe"
                className="form-control"
                disabled={methods.formState.isSubmitting}
              />
              <FormErrorMessage>
                {methods.formState.errors["beschrijving"] &&
                  methods.formState.errors["beschrijving"].message}
              </FormErrorMessage>
            </FormControl>
          </div>
          <div className="mb-3">
            <LabelInput label="Prijs:" name="prijsString" type="number" />
          </div>

          <div className="mb-3">
            <FormLabel>Moet inschrijven?</FormLabel>
            <FormControl>
              <RadioGroup defaultValue="nee" id="moetInschrijvenString">
                <Stack direction="row">
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
              <FormErrorMessage>
                {methods.formState.errors["moetInschrijvenString"] &&
                  methods.formState.errors["moetInschrijvenString"].message}
              </FormErrorMessage>
            </FormControl>
          </div>
          <Button
            type="submit"
            colorScheme="red"
            isDisabled={methods.formState.isSubmitting}
          >
            {currentActiviteit?.activiteitId ? "Sla activiteit op" : "Voeg toe"}
          </Button>
        </form>
      </FormProvider>
    </>
  );
}
