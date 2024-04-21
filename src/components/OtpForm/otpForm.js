import { useState } from "react";
import styles from "./otpForm.module.css";
import { userSelector, verifyCode } from "../../redux/reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/spinner";

export default function OtpForm() {
  const [code, setCode] = useState(null);
  const dispatch = useDispatch();
  const { loader } = useSelector(userSelector);

  function handleSubmit(e) {
    e.preventDefault();
    if (code && code.length === 6) {
      dispatch(verifyCode(code));
    }
  }

  return (
    <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
      <h2 style={{ color: "var(--theme)" }}>Verify Your Phone Number</h2>
      <h4>Enter the OTP sent to your Mobile phone to continue.</h4>

      <div className={styles.inputs}>
        <label>Enter the OTP: </label>
        <input
          className={styles.input}
          type="text"
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <button type="submit" className={styles.btn}>
        {loader ? <Spinner /> : "Continue"}
      </button>
    </form>
  );
}
