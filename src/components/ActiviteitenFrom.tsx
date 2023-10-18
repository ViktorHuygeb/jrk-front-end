import { ACTIVITEITEN_DATA } from "../api/mock_data";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

const toDateString = (date: Date) => {
  let besteDatumString: string = "";
  let datumString: string = date.toISOString();
  let datumStringZonderTijd: string = datumString.substring(
    0,
    datumString.indexOf("T")
  );
  let tokens = datumStringZonderTijd.split("-");
  for (let token in tokens.reverse) {
    if (tokens.indexOf(token) === 2) {
      token = omzettenNaarMaand(token);
    }
    besteDatumString += token;
  }
};

const validationRules = {
  naam: {
    required: "Activiteitnaam is verplicht !",
    minLength: { value: 2, message: "Minimum naamlengte is 2" },
  },
  datum: { required: "Geen datum, geen activiteit !" },
  beschrijving: {
    required: "De kindjes willen iets weten !",
  },
};

const omzettenNaarMaand = (monthNumber: string) => {
  let monthName: string;
  switch (monthNumber) {
    case "1":
      monthName = "januari";
      break;
    case "2":
      monthName = "februari";
      break;
    case "3":
      monthName = "maart";
      break;
    case "4":
      monthName = "april";
      break;
    case "5":
      monthName = "mei";
      break;
    case "6":
      monthName = "juni";
      break;
    case "7":
      monthName = "juli";
      break;
    case "8":
      monthName = "augustus";
      break;
    case "9":
      monthName = "september";
      break;
    case "10":
      monthName = "oktober";
      break;
    case "11":
      monthName = "november";
      break;
    case "12":
      monthName = "december";
      break;
    default:
      monthName = "Ongeldige maand";
  }
  return monthName;
};
