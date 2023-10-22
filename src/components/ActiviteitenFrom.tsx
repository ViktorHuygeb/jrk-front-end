import {
  FormProvider,
  useForm,
  useFormContext,
  RegisterOptions,
} from "react-hook-form";
import { useCallback } from "react";

const validationRules = {
  naam: {
    required: "Activiteitnaam is verplicht !",
    minLength: { value: 2, message: "Minimum naamlengte is 2" },
  },
  datum: { required: "Geen datum, geen activiteit !" },
  beschrijving: {
    required: "De kindjes willen iets weten !",
  },
  prijs: {
    valueAsNumber: true,
    required: "Prijs is verplicht, indien gratis voer 0 in !",
    min: { value: 0, message: "Het moet minstens 0 euro zijn !" },
  },
};

interface labelInputProps {
  label: string;
  name: string;
  type: string;
  validationRules: RegisterOptions;
  [key: string]: any;
}

function LabelInput({
  label,
  name,
  type,
  validationRules,
  ...rest
}: labelInputProps) {
  const { register } = useFormContext();

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        {...register(name, validationRules)}
        id={name}
        type={type}
        className="form-control"
        {...rest}
      />
    </div>
  );
}

const toDateString = (date: Date) => {
  let besteDatumString: string = "";
  let datumString: string = new Date(date).toISOString();
  let datumStringZonderTijd: string = datumString.substring(
    0,
    datumString.indexOf("T")
  );
  let tokens = datumStringZonderTijd.split("-");
  for (let token in tokens.reverse()) {
    let datumValue = tokens[token];
    if (token === "1") {
      datumValue = omzettenNaarMaand(datumValue);
    }
    besteDatumString += datumValue + " ";
  }
  return besteDatumString;
};

const omzettenNaarMaand = (monthNumber: string) => {
  let monthName: string;
  switch (monthNumber) {
    case "01":
      monthName = "Januari";
      break;
    case "02":
      monthName = "Februari";
      break;
    case "03":
      monthName = "Maart";
      break;
    case "04":
      monthName = "April";
      break;
    case "05":
      monthName = "Mei";
      break;
    case "006":
      monthName = "Juni";
      break;
    case "07":
      monthName = "Juli";
      break;
    case "08":
      monthName = "Augustus";
      break;
    case "09":
      monthName = "September";
      break;
    case "10":
      monthName = "Oktober";
      break;
    case "11":
      monthName = "November";
      break;
    case "12":
      monthName = "December";
      break;
    default:
      monthName = "Ongeldige maand";
  }
  return monthName;
};

type FormData = {
  naam: string;
  datum: Date;
  beschrijving: string;
  prijs: number;
};

type saveActiviteitFunction = (
  naam: string,
  datum: string,
  beschrijving: string,
  prijs: number
) => void;

export default function ActiviteitenForm({
  onSaveActiviteit,
}: {
  onSaveActiviteit: saveActiviteitFunction;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = useCallback(
    (data: FormData) => {
      const { naam, datum, beschrijving, prijs } = data;
      onSaveActiviteit(naam, toDateString(datum), beschrijving, prijs);
      reset();
    },
    [reset, onSaveActiviteit]
  );

  return (
    <>
      <h2>Voeg een activiteit toe !</h2>
      <FormProvider
        handleSubmit={handleSubmit}
        register={register}
        errors={errors}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="mb-5">
          <div className="mb-3">
            <LabelInput
              label="naam"
              name="naam"
              type="text"
              validationRules={validationRules.naam}
            />
          </div>

          <div className="mb-3">
            <LabelInput
              label="datum"
              name="datum"
              type="date"
              validationRules={validationRules.datum}
            />
          </div>

          <div className="mb-3">
            <LabelInput
              label="beschrijving"
              name="beschrijving"
              type="text"
              validationRules={validationRules.beschrijving}
            />
          </div>

          <div className="mb-3">
            <LabelInput
              label="prijs"
              name="prijs"
              type="number"
              placeholder="0"
              validationRules={validationRules.beschrijving}
            />

            <div className="clearfix">
              <div className="btn-group float-end">
                <button type="submit" className="btn btn-primary">
                  Voeg Activiteit toe !
                </button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
