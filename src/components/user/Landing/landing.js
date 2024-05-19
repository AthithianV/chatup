import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { loginGuest, userAction } from "../../../redux/reducers/userReducer";

export default function AuthOption() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="form center">
      <h2>Log in / Register to Continue</h2>
      <div
        style={{ borderBottom: "1px solid lightgrey", paddingBottom: "15px" }}
      >
        <NavLink to={"login"}>
          <button className="userButton">Log in</button>
        </NavLink>
        <NavLink to={"register"}>
          <button className="userButton">Register</button>
        </NavLink>
      </div>
      <button
        className="userButton"
        onClick={() => {
          dispatch(loginGuest());
          navigate("/");
        }}
      >
        Login as Guest
      </button>
    </div>
  );
}
