import { useSelector, useDispatch } from "react-redux";
import styles from "./register.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { register, userSelector } from "../../../redux/reducers/userReducer";
import { BeatLoader } from "react-spinners";

export default function RegisterForm() {
  const { tempUser, loader } = useSelector(userSelector);

  const navigate = useNavigate();

  useEffect(() => {
    if (tempUser) {
      navigate("/user/login");
    }
  }, [navigate, tempUser]);


  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const dispatch = useDispatch();

  const handleSubmit = () => {
    console.log({ username, email, password });
    dispatch(register({ username, email, password}));
  };

  return (
    <form
      className="form center"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h2 className={styles.m10}>Please Register to Continue: </h2>

      <div className={styles.formElement}>
        <label htmlFor="username">Name: </label>
        <input
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          name="username"
          id="username"
          required
        />
      </div>
      
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
        {loader ? <BeatLoader size={10} color="black" /> : "Register"}
      </button>
    </form>
  );
}
