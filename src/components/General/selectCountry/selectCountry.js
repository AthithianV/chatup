import styles from "./selectCountry.module.css";

import countryList from "../../../data/countryList";
import codes from "../../../data/country.json";

export default function SelectCountry({ setCode }) {
  return (
    <select
      className={styles.select}
      onChange={(e) => {
        setCode("+" + codes[e.target.value]);
      }}
    >
      <option>Select Your Country</option>
      {countryList.map((c, index) => (
        <option key={index}>{c}</option>
      ))}
    </select>
  );
}
