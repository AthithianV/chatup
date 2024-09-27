import { useEffect, useState } from "react";
import styles from "./LoginForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { login, userSelector } from "../../../redux/reducers/userReducer";

import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { loader, user } = useSelector(userSelector);

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  function handleSubmit() {
    dispatch(login({ email, password }));
  }

  return (
    <form
      className="form center"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h2 className={styles.m10}>Login: </h2>

      <div className={styles.formElement}>
        <label htmlFor="email">Email: </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          id="email"
          required
        />
      </div>

      <div className={styles.formElement}>
        <label htmlFor="password">Password: </label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          id="password"
          required
        />
      </div>

      <button className="userButton" type="submit" id="register-button">
        {loader ? <BeatLoader size={10} color="black" /> : "Login"}
      </button>
    </form>
  );
}
