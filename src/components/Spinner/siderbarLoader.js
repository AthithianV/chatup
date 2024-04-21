import styles from "./siderbarLoader.module.css";
import { BeatLoader } from "react-spinners";

export default function SiderBarLoader() {
  return (
    <div className={styles.container}>
      <BeatLoader
        color={"black"}
        loading={true}
        size={25}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}
