import "./App.css";
import LedenLijst from "./components/leden/LedenLijst";
import ActiviteitenLijst from "./components/activiteiten/ActiviteitenLijst";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <>
      <ChakraProvider>
        <ActiviteitenLijst />
        <LedenLijst />
      </ChakraProvider>
    </>
  );
}

export default App;
