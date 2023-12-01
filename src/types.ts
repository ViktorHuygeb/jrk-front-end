export type lidType = {
  lidId: number;
  ouderId: number;
  geboortedatum: Date;
  magFotos: boolean;
  voorNaam: string;
  familieNaam: string;
};

export type activiteit = {
  activiteitId: number;
  leidingId: number;
  activiteitNaam: string;
  datum: Date;
  beschrijving: string;
  prijs: number;
  moetInschrijven: boolean;
};

export type leidingType = {
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

export type ouderType = {
  ouderId: number;
  voorNaam: string;
  familieNaam: string;
  email: string;
  telefoonNummer: string;
  straat: string;
  huisnummer: number;
  postcode: number;
  stad: string;
};

export type inschrijvingType = {
  lidId: number;
  activiteitId: number;
};
