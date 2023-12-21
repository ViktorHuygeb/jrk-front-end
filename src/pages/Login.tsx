import { FormProvider, Resolver, useForm } from "react-hook-form";
import LabelInput from "../components/LabelInput";
import { useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/Auth.context";
import Error from "../components/Error";
import { Flex, Heading, Button, Stack, Box, Avatar } from "@chakra-ui/react";

type inlogData = {
  email: string;
  password: string;
};

const resolver: Resolver<inlogData> = async (values) => {
  const errors: Record<string, Record<string, unknown>> = {};

  if (!values.email) {
    errors.email = {
      message: "Email is verplicht!",
    };
  }
  if (!values.password) {
    errors.password = {
      message: "Wachtwoord is verplicht!",
    };
  }

  return {
    values: Object.keys(values).length > 0 ? values : {},
    errors: Object.keys(errors).length > 0 ? errors : {},
  };
};

export default function Login() {
  const { error, loading, login } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();

  const redirect = useMemo(() => {
    const urlParams = new URLSearchParams(search);
    if (urlParams.has("redirect")) {
      return urlParams.get("redirect");
    }
    return "/";
  }, [search]);

  const methods = useForm<inlogData>({
    resolver,
  });

  const { handleSubmit, reset } = methods;

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  const handleLogin = useCallback(
    async ({ email, password }: inlogData) => {
      const loggedIn = await login(email, password);

      if (loggedIn) {
        navigate({
          pathname: redirect || "/",
        });
      }
    },
    [login, navigate, redirect]
  );

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="90vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="red" />
        <Heading color="#282828">Welkom</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <FormProvider {...methods}>
            <form
              className="d-flex flex-column"
              onSubmit={handleSubmit(handleLogin)}
            >
              <Stack
                spacing={4}
                p="1rem"
                boxShadow="md"
                border="1px solid lightgray"
                borderRadius={4}
              >
                <Error error={error} />

                <LabelInput
                  label="E-mail:"
                  type="text"
                  name="email"
                  placeholder="your@email.com"
                  data-cy="email_input"
                />

                <LabelInput
                  label="Wachtwoord:"
                  placeholder="Wachtwoord"
                  type="password"
                  name="password"
                  data-cy="password_input"
                />

                <div className="clearfix">
                  <div className="btn-group float-end">
                    <Button
                      type="submit"
                      disabled={loading}
                      colorScheme="red"
                      marginRight="10px"
                      data-cy="login_button"
                    >
                      Sign in
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
    </Flex>
  );
}
