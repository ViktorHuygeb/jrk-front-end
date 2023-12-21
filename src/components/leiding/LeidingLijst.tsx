import useSWR from "swr";
import Leiding from "./Leiding";
import { getAll } from "../../api";
import { leidingType } from "../../types";
import { SimpleGrid } from "@chakra-ui/react";
import AsyncData from "../AyncData";

export default function LeidingLijst() {
  const { data: leiding = [], isLoading, error } = useSWR("leiding", getAll);

  return (
    <AsyncData loading={isLoading} error={error}>
      {!error ? (
        <SimpleGrid
          spacing={3}
          justifyContent={"center"}
          templateColumns="repeat(4, 350px)"
          padding="20px"
          key={201}
        >
          {leiding.map((l: leidingType) => {
            return (
              <Leiding
                key={l.leidingId}
                voorNaam={l.voorNaam}
                familieNaam={l.familieNaam}
                leidingId={l.leidingId}
              />
            );
          })}
        </SimpleGrid>
      ) : null}
    </AsyncData>
  );
}
