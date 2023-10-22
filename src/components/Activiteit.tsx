import { memo } from "react";

const Activiteit = ({
  naam,
  id,
  prijs,
  beschrijving,
  datum,
}: {
  naam: string;
  id: number;
  prijs: number;
  beschrijving: string;
  datum: string;
}) => {
  return (
    <div className="Activiteit">
      <h1>{naam}</h1>
      <p>{datum}</p>
      <p>{beschrijving}</p>
      <p>Deze activiteit {prijs == 0 ? "is gratis" : "kost €" + prijs}</p>
    </div>
  );
};

export default memo(Activiteit);
