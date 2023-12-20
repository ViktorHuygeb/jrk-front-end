import { FormProvider, Resolver, useForm } from "react-hook-form";
import LabelInput from "../components/LabelInput";
import { useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/Auth.context";
import Error from "../components/Error";
import { Flex, Heading, Button, Stack, Box, Avatar } from "@chakra-ui/react";
import { SubmitHandler } from "react-hook-form";

type registerData = {
  voorNaam: string;
  familieNaam: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  straat: string;
  huisnummer: number;
  postcode: number;
  stad: string;
  geboortedatum: Date;
};

const resolver: Resolver<registerData> = async (values) => {
  const errors: Record<string, Record<string, unknown>> = {};
  if (!values.voorNaam) {
    errors.voorNaam = {
      message: "Voornaam is verplicht!",
    };
  }

  if (!values.familieNaam) {
    errors.familieNaam = {
      message: "Familienaam is verplicht!",
    };
  }

  if (!values.email) {
    errors.email = {
      message: "Email is verplicht!",
    };
  }

  if (!values.password) {
    errors.password = {
      message: "Wachtwoord is verplicht!",
    };
  } else if (values.password.length < 8) {
    errors.password = {
      message: "Wachtwoord moet minstens 8 karakters lang zijn!",
    };
  }

  if (!values.passwordConfirmation) {
    errors.passwordConfirmation = {
      message: "Wachtwoord bevestiging is verplicht!",
    };
  } else if (values.password !== values.passwordConfirmation) {
    errors.passwordConfirmation = {
      message: "Bevestigingswachtwoord en wachtwoord komen niet overeen!",
    };
  }

  if (!values.straat) {
    errors.straat = {
      message: "Straat is verplicht!",
    };
  }

  if (!values.huisnummer) {
    errors.huisnummer = {
      message: "Huisnummer is verplicht!",
    };
  }

  if (!values.postcode) {
    errors.postcode = {
      message: "Postcode is verplicht!",
    };
  } else if (values.postcode < 1000 || values.postcode > 9999) {
    errors.postcode = {
      message: "Postcode moet een geldige Belgische postcode zijn!",
    };
  }

  if (!values.stad) {
    errors.stad = {
      message: "Stad is verplicht!",
    };
  }

  if (!values.geboortedatum) {
    errors.geboortedatum = {
      message: "Geboortedatum is verplicht!",
    };
  }
  if (values.geboortedatum > new Date()) {
    errors.geboortedatum = {
      message: "Geboortedatum moet in het verleden liggen!",
    };
  }

  return {
    values: Object.keys(values).length > 0 ? values : {},
    errors: Object.keys(errors).length > 0 ? errors : {},
  };
};

export default function RegisterLeiding() {
  const { registerLeidingError, registerLeidingLoading, registerLeiding } =
    useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = useMemo(() => {
    const urlParams = new URLSearchParams(search);
    if (urlParams.has("redirect")) {
      return urlParams.get("redirect");
    }
    return "/";
  }, [search]);

  const methods = useForm<registerData>({
    resolver,
  });

  const { handleSubmit, reset } = methods;

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  const handleRegister: SubmitHandler<registerData> = useCallback(
    async (data) => {
      const {
        voorNaam,
        familieNaam,
        email,
        password,
        straat,
        huisnummer,
        postcode,
        stad,
        geboortedatum,
      } = data;
      const registered = await registerLeiding({
        voorNaam,
        familieNaam,
        email,
        password,
        straat,
        huisnummer: parseInt(huisnummer.toString()),
        postcode: parseInt(postcode.toString()),
        stad,
        geboortedatum: new Date(geboortedatum),
      });

      console.log(registered);
      if (registered) {
        navigate({
          pathname: redirect || "/",
        });
      }
    },
    [registerLeiding, navigate, redirect]
  );

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="90vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack spacing={40} mb="2" direction={"row"}>
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
        >
          <Box minW={{ base: "90%", md: "468px" }}>
            <FormProvider {...methods}>
              <form
                className="d-flex flex-column"
                onSubmit={handleSubmit(handleRegister)}
              >
                <Stack
                  spacing={2}
                  p="1rem"
                  boxShadow="md"
                  border="1px solid lightgray"
                  borderRadius={4}
                >
                  <Error error={registerLeidingError} />

                  <Stack direction="row" spacing={4}>
                    <LabelInput
                      label="Voornaam:"
                      type="text"
                      name="voorNaam"
                      placeholder="Voornaam"
                    />

                    <LabelInput
                      label="Familienaam:"
                      type="text"
                      name="familieNaam"
                      placeholder="Familienaam"
                    />
                  </Stack>

                  <LabelInput
                    label="Geboortedatum:"
                    type="date"
                    name="geboortedatum"
                    placeholder="Geboortedatum"
                  />

                  <Stack spacing={4} align="start" direction="row">
                    <LabelInput
                      label="Straat:"
                      type="text"
                      name="straat"
                      placeholder="Straat"
                    />
                    <LabelInput
                      label="Huisnummer:"
                      type="number"
                      name="huisnummer"
                      placeholder="eg. 1"
                    />
                  </Stack>

                  <Stack spacing={4} align="start" direction="row">
                    <LabelInput
                      label="Postcode:"
                      type="number"
                      name="postcode"
                      placeholder="eg. 2000"
                    />
                    <LabelInput
                      label="Stad:"
                      type="text"
                      name="stad"
                      placeholder="Stad"
                    />
                  </Stack>

                  <LabelInput
                    label="E-mail:"
                    type="text"
                    name="email"
                    placeholder="your@email.com"
                  />

                  <LabelInput
                    label="Wachtwoord:"
                    placeholder="Wachtwoord"
                    type="password"
                    name="password"
                  />

                  <LabelInput
                    label="Wachtwoord bevestiging:"
                    placeholder="Wachtwoord bevestiging"
                    type="password"
                    name="passwordConfirmation"
                  />

                  <div className="clearfix">
                    <div className="btn-group float-end">
                      <Button
                        type="submit"
                        onSubmit={handleSubmit(handleRegister)}
                        disabled={registerLeidingLoading}
                        colorScheme="red"
                        marginRight="10px"
                      >
                        Registreer
                      </Button>

                      <Button
                        type="button"
                        className="btn btn-light"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Stack>
              </form>
            </FormProvider>
          </Box>
        </Stack>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignContent="center"
        >
          <Stack
            flexDir="column"
            mb="2"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar bg="red" />
            <Heading color="#282828">Registreer als leiding</Heading>
          </Stack>
        </Flex>
      </Stack>
    </Flex>
  );
}
