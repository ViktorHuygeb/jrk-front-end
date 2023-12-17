import { Outlet, NavLink, ScrollRestoration } from "react-router-dom";

export default function Root() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="activiteiten">Activiteiten</NavLink>
          </li>
          <li>
            <NavLink to="leden">Leden</NavLink>
          </li>
          <div id="logo">Jeugd Rode Kruis</div>
          <li>
            <NavLink to="leiding">Leiding</NavLink>
          </li>
          <li>
            <NavLink to="contact">Contact</NavLink>
          </li>
        </ul>
      </nav>

      <Outlet />
      <ScrollRestoration />
    </div>
  );
}
