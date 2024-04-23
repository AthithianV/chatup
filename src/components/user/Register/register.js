import { useSelector, useDispatch } from "react-redux";
import styles from "./register.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRef, useState } from "react";
import notifyError from "../../../util/notifyError";
import { register, userSelector } from "../../../redux/reducers/userReducer";
import SelectCountry from "../../General/selectCountry/selectCountry";
import { BeatLoader } from "react-spinners";

export default function RegisterForm() {
  const { tempUser, loader } = useSelector(userSelector);

  const navigate = useNavigate();

  useEffect(() => {
    if (tempUser) {
      navigate("/user/verify-code");
    }
  }, [navigate, tempUser]);

  const [isUploaded, setIsuploaded] = useState(false);

  const [code, setCode] = useState("_ _");
  const [phone, setPhone] = useState(null);
  const [name, setName] = useState(null);

  const imageRef = useRef();
  const dispatch = useDispatch();

  const validImage = () => {
    if (imageRef.current.files.length === 0) {
      notifyError("Please Upload a Profile Image");
      return false;
    } else if (imageRef.current.files.length > 1) {
      notifyError("Please upload single image");
      return false;
    } else if (!imageRef.current.files[0].type.startsWith("image/")) {
      notifyError("Please upload image file");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validImage()) {
      return;
    }
    dispatch(register({ code, name, phone, image: imageRef.current.files[0] }));
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

      <table className={styles.table}>
        <tbody>
          <tr>
            <td>
              <label>Name: </label>
            </td>
            <td className={styles.input}>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter Your Name"
                required
              />
            </td>
          </tr>

          <tr>
            <td>Select Your Country: </td>
            <td className={styles.input}>
              <SelectCountry setCode={setCode} />
            </td>
          </tr>

          <tr>
            <td>
              <label>Country Code: </label>
            </td>
            <td className={styles.input}>
              <input
                onChange={(e) => setCode(e.target.value)}
                className={styles.code}
                type="text"
                required
                disabled
                value={code}
              />
            </td>
          </tr>

          <tr>
            <td>
              <label>Phone Number: </label>
            </td>
            <td className={styles.input}>
              <input
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 91XXXXXXXX"
                type="text"
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <label
        className={`${styles.upload} center ${
          isUploaded ? `${styles.selected}` : ""
        }`}
        htmlFor="upload"
      >
        {isUploaded ? (
          <img
            src="https://cdn-icons-png.flaticon.com/128/11560/11560647.png"
            alt="upload ok"
          />
        ) : (
          <img
            src="https://cdn-icons-png.flaticon.com/128/45/45010.png"
            alt="upload"
          />
        )}
        {!isUploaded ? (
          <h3 className={styles.m10}>Click Here to upload your Picture</h3>
        ) : (
          <h3 className={styles.m10}>Image has been Chosen</h3>
        )}
      </label>

      <input
        onChange={() => setIsuploaded(true)}
        ref={imageRef}
        className={styles.uploadField}
        id="upload"
        type="file"
        placeholder="Upload"
      />

      <button className="userButton" type="submit" id="register-button">
        {loader ? <BeatLoader size={10} color="black" /> : "Continue"}
      </button>
    </form>
  );
}
