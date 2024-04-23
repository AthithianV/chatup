import { useEffect, useState } from "react";
import styles from "./otpForm.module.css";
import { userSelector, verifyCode } from "../../../redux/reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

export default function OtpForm() {
  const [code, setCode] = useState(null);
  const dispatch = useDispatch();
  const { loader, tempUser, user } = useSelector(userSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tempUser) {
      navigate("/user");
    }
  }, [tempUser, navigate]);

  useEffect(() => {
    if (user) {
      navigate("");
    }
  }, [user, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(tempUser);
    if (code && code.length === 6) {
      dispatch(verifyCode({ code, user: tempUser }));
    }
  }

  return (
    <form className="form center" onSubmit={(e) => handleSubmit(e)}>
      <h2 style={{ color: "var(--theme)" }}>Verify Your Phone Number</h2>
      <h3>Enter the code sent to your Mobile phone to continue.</h3>

      <div className={styles.inputs}>
        <label>Verification Code: </label>
        <input
          className={styles.input}
          type="text"
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <button type="submit" className="userButton">
        {loader ? <BeatLoader size={10} color={"black"} /> : "Continue"}
      </button>
    </form>
  );
}
