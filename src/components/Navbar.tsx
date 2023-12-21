import { Outlet, NavLink, ScrollRestoration } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../contexts/Auth.context";

export default function Navbar() {
  const { isLeiding, isAuthed } = useAuth();

  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="activiteiten" data-cy="activiteiten">
              Activiteiten
            </NavLink>
          </li>
          {isLeiding && (
            <li>
              <NavLink to="leden" data-cy="leden">
                Leden
              </NavLink>
            </li>
          )}
          <div id="logo">Jeugd Rode Kruis</div>
          <li>
            <NavLink to="leiding">Leiding</NavLink>
          </li>
          <li>
            <NavLink to="contact">Contact</NavLink>
          </li>

          {isAuthed ? (
            <li>
              <NavLink to="/logout">Logout</NavLink>
            </li>
          ) : (
            <>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/registerLeiding">Register</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      <Outlet />
      <ScrollRestoration />
    </div>
  );
}
