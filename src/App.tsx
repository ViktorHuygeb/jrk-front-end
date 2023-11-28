import "./App.css";
import ActiviteitenFrom from "./components/activiteiten/ActiviteitenForm";
import ActiviteitenLijst from "./components/activiteiten/ActiviteitenLijst";
import { ChakraProvider, Center } from "@chakra-ui/react";

function App() {
  return (
    <>
      <ChakraProvider>
        <ActiviteitenLijst />
      </ChakraProvider>
    </>
  );
}

export default App;
