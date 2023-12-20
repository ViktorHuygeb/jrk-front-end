import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { About, Contact, Home, NotFound } from "./pages.tsx";
import ActiviteitenLijst from "./components/activiteiten/ActiviteitenLijst.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import Root from "./Root.tsx";
import LeidingLijst from "./components/leiding/LeidingLijst.tsx";
import LedenLijst from "./components/leden/LedenLijst.tsx";
import { AuthProvider } from "./contexts/Auth.context.tsx";
import Login from "./pages/Login.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import Logout from "./pages/Logout.tsx";
import RegisterLeiding from "./pages/RegisterLeiding.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/",
        element: <Home />,
      },
      { path: "activiteiten", element: <ActiviteitenLijst /> },
      { path: "contact", element: <Contact /> },
      { path: "leiding", element: <LeidingLijst /> },
      {
        path: "leden",
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <LedenLijst />,
          },
        ],
      },
      { path: "registerLeiding", element: <RegisterLeiding /> },
      { path: "login", element: <Login /> },
      { path: "logout", element: <Logout /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>
);
