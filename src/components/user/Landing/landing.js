import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { userAction } from "../../../redux/reducers/userReducer";

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
      {/* <button
        className="userButton"
        onClick={() => {
          dispatch(
            userAction.setUser({
              id: "Ig2eNx43ZEKpDrHOCsl2",
              name: "Guest",
              image: "https://cdn-icons-png.flaticon.com/128/3870/3870239.png",
            })
          );
          navigate("/");
        }}
      >
        Login as Guest
      </button> */}
    </div>
  );
}
