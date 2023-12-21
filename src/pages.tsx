import { LoremIpsum } from "react-lorem-ipsum";
import { useLocation } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Hier is nog niet veel te zien !</p>
    </div>
  );
};

export const About = () => {
  return (
    <div>
      <h1>Over ons</h1>
      <LoremIpsum p={2} />
    </div>
  );
};

export const Contact = () => {
  return (
    <div>
      <h1>Contact</h1>
      <LoremIpsum p={2} />
    </div>
  );
};

export const NotFound = () => {
  const { pathname } = useLocation();
  return (
    <div>
      <h1>Pagina niet gevonden</h1>
      <p>Er is geen pagina met op als url {pathname}, probeer iets anders.</p>
    </div>
  );
};
