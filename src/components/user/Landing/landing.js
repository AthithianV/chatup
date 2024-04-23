import { NavLink } from "react-router-dom";

export default function AuthOption() {
  return (
    <div className="form center">
      <h2>Log in / Register to Continue</h2>
      <div>
        <NavLink to={"login"}>
          <button className="userButton">Log in</button>
        </NavLink>
        <NavLink to={"register"}>
          <button className="userButton">Register</button>
        </NavLink>
      </div>
    </div>
  );
}
