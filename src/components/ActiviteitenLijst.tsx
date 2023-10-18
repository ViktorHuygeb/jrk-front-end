import { useState } from "react";
import { ACTIVITEITEN_DATA } from "../api/mock_data";
import Activiteit from "./Activiteit";

const ActiviteitenLijst = () => {
  const [activiteiten, setActiviteiten] = useState(ACTIVITEITEN_DATA);

  return (
    <div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-3">
        {activiteiten.map((a) => (
          <div className="col" key={a.id}>
            <Activiteit {...a} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiviteitenLijst;
