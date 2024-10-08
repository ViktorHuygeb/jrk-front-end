import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
} from "react";
import useSWRMutation from "swr/mutation";
import * as api from "../api";

const JWT_TOKEN_KEY = "jwt_token";
const USER_ID_KEY = "user_id";
const USER_ROLES = "roles";
const AuthContext = createContext<{
  token: any;
  user: any;
  error: any;
  registerLeidingError: any;
  loading: any;
  registerLeidingLoading: any;
  ready: any;
  isLeiding: any;
  isAuthed: any;
  login: any;
  logout: any;
  registerLeiding: any;
}>({
  token: null,
  user: null,
  error: null,
  registerLeidingError: null,
  loading: null,
  registerLeidingLoading: null,
  ready: null,
  isLeiding: null,
  isAuthed: null,
  login: null,
  logout: null,
  registerLeiding: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [ready, setReady] = useState(false);
  const [isLeiding, setIsLeiding] = useState(false);
  const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [isAuthed, setIsAuthed] = useState(false);

  const {
    isMutating: loading,
    error,
    trigger: doLogin,
  } = useSWRMutation<any, any, any, { email: string; password: string }>(
    "users/login",
    api.post
  );

  useEffect(() => {
    api.setAuthToken(token);
    setIsAuthed(Boolean(token));
    setReady(true);
    setIsLeiding(
      localStorage.getItem(USER_ROLES)?.includes("Leiding\\") || false
    );
  }, [token]);

  const {
    isMutating: registerLeidingLoading,
    error: registerLeidingError,
    trigger: doRegisterLeiding,
  } = useSWRMutation("leiding/register", api.post);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        let userId = "";
        const loginData = await doLogin({ email, password });

        const { token, roles } = loginData;

        if ("leiding" in loginData) {
          const { leiding } = loginData;
          userId = leiding.leidingId;
        } else if ("ouder" in loginData) {
          const { ouder } = loginData;
          userId = ouder.ouderId;
        }

        console.log(loginData);

        setToken(token);
        setUser(user);

        localStorage.setItem(JWT_TOKEN_KEY, token);
        localStorage.setItem(USER_ID_KEY, userId);
        localStorage.setItem(USER_ROLES, JSON.stringify(roles));

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [doLogin]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsLeiding(false);

    localStorage.removeItem(JWT_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_ROLES);
  }, []);

  const registerLeiding = useCallback(
    async (data: any) => {
      try {
        const registerData = await doRegisterLeiding(data);
        const { token, roles, leiding } = registerData;
        const leidingId = leiding.leidingId;

        setToken(token);
        setUser(leidingId);

        localStorage.setItem(JWT_TOKEN_KEY, token);
        localStorage.setItem(USER_ID_KEY, leidingId);
        localStorage.setItem(USER_ROLES, JSON.stringify(roles));

        setIsLeiding(
          localStorage.getItem(USER_ROLES)?.includes("Leiding\\") || false
        );
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [doRegisterLeiding]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      error,
      registerLeidingError,
      loading,
      registerLeidingLoading,
      ready,
      isLeiding,
      isAuthed,
      login,
      logout,
      registerLeiding,
    }),
    [
      token,
      user,
      error,
      registerLeidingError,
      loading,
      registerLeidingLoading,
      ready,
      isLeiding,
      isAuthed,
      login,
      logout,
      registerLeiding,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
