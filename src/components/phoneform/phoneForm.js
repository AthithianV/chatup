import { useRef, useState } from "react";
import styles from "./phoneForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { signUp, userSelector } from "../../redux/reducers/userReducer";

import countryList from "../../data/countryList";
import codes from "../../data/country.json";
import Spinner from "../Spinner/spinner";

export default function PhoneForm() {
  const countryRef = useRef();
  const dispatch = useDispatch();
  const { loader } = useSelector(userSelector);

  const [country, setCountry] = useState("Select Your Country");
  const [code, setCode] = useState(null);
  const [phone, setPhone] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (phone) {
      dispatch(signUp(`+${code}${phone}`));
    }
  }

  return (
    <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
      <h2 style={{ color: "var(--theme)" }}>Verify Your Phone Number</h2>
      <h4>
        Chatap will sent you a SMS message to verify your phone number. you will
        receive an SMS message for verification and standard rates apply.
      </h4>
      <select
        className={styles.select}
        onChange={(e) => {
          setCountry(e.target.value);
          setCode(codes[e.target.value]);
        }}
      >
        <option>Select Your Country</option>
        {countryList.map((c, index) => (
          <option key={index}>{c}</option>
        ))}
      </select>
      {code && (
        <div className={styles.inputs}>
          <span className={styles.code}>+{code}</span>
          <input
            className={`${styles.input} ${styles.country}`}
            type="text"
            placeholder="_ _ _ _ _   _ _ _ _ _"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      )}
      {code && (
        <button type="submit" id="sign-in-button" className={styles.btn}>
          {loader ? <Spinner /> : "Next"}
        </button>
      )}
    </form>
  );
}
