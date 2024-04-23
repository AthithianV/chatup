import { useEffect, useState } from "react";
import styles from "./LoginForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { login, userSelector } from "../../../redux/reducers/userReducer";

import { useNavigate } from "react-router-dom";
import SelectCountry from "../../General/selectCountry/selectCountry";
import { BeatLoader } from "react-spinners";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { loader, tempUser } = useSelector(userSelector);

  const [code, setCode] = useState(null);
  const [phone, setPhone] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (tempUser) {
      navigate("/user/verify-code");
    }
  }, [navigate, tempUser]);

  function handleSubmit(e) {
    e.preventDefault();
    if (phone) {
      dispatch(login({ code, phone }));
    }
  }

  return (
    <form className={`form center`} onSubmit={(e) => handleSubmit(e)}>
      <h2 style={{ color: "var(--theme)" }}>Verify Your Phone Number</h2>
      <h4 style={{ maxWidth: "60%", textAlign: "center" }}>
        Chatup will sent you a SMS message to verify your phone number. you will
        receive an SMS message for verification and standard rates apply.
      </h4>
      <SelectCountry setCode={setCode} />
      {code && (
        <div className={styles.inputs}>
          <span className={styles.code}>{code}</span>
          <input
            className={`${styles.input} ${styles.country}`}
            type="text"
            placeholder="Phone Number"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      )}
      {code && (
        <button type="submit" id="login-button" className="userButton">
          {loader ? <BeatLoader color={"black"} size={10} /> : "Next"}
        </button>
      )}
    </form>
  );
}
