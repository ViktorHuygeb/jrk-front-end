import "./App.css";
import LedenLijst from "./components/leden/LedenLijst";
import ActiviteitenLijst from "./components/activiteiten/ActiviteitenLijst";
import { ChakraProvider } from "@chakra-ui/react";
import LeidingLijst from "./components/leiding/LeidingLijst";

function App() {
  return (
    <>
      <ChakraProvider>
        <ActiviteitenLijst />
        <LedenLijst />
        {/* <LeidingLijst /> */}
      </ChakraProvider>
    </>
  );
}

export default App;
