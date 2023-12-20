import { useEffect } from "react";
import { useAuth } from "../contexts/Auth.context";

export default function Logout() {
  const { isAuthed, logout } = useAuth();

  // 👇 1
  useEffect(() => {
    logout();
  }, [logout]);

  if (isAuthed) {
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <h1>Logging out...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <h1>You were successfully logged out</h1>
        </div>
      </div>
    </div>
  );
}
