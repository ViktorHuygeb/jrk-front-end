import { useState, useCallback } from "react";
import { ACTIVITEITEN_DATA } from "../api/mock_data";
import Activiteit from "./Activiteit";
import ActiviteitenForm from "./ActiviteitenFrom";
import { act } from "react-dom/test-utils";

const ActiviteitenLijst = () => {
  const [activiteiten, setActiviteiten] = useState(ACTIVITEITEN_DATA);

  const createActiviteit = useCallback(
    (naam: string, datum: string, beschrijving: string, prijs: number) => {
      console.log(activiteiten);
      const newActiviteiten = [
        {
          naam,
          beschrijving,
          prijs,
          datum: datum,
          id: Math.floor(Math.random() * 100) + 2,
        },
        ...activiteiten,
      ];
      console.log(newActiviteiten);
      setActiviteiten(newActiviteiten);
    },
    [activiteiten]
  );

  return (
    <div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-3">
        {activiteiten.map((a) => (
          <div className="col" key={a.id}>
            <Activiteit {...a} />
          </div>
        ))}
      </div>
      <ActiviteitenForm onSaveActiviteit={createActiviteit} />
    </div>
  );
};

export default ActiviteitenLijst;
