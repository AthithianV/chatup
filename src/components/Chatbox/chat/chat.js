import { useSelector } from "react-redux";
import styles from "./chat.module.css";
import { userSelector } from "../../../redux/reducers/userReducer";

export default function Chat({ chat }) {
  const { user } = useSelector(userSelector);

  let t = new Date(chat.time);
  t.setHours(t.getHours() + 5);
  t.setMinutes(t.getMinutes() + 30);

  return (
    <div
      style={user ? { justifyContent: "end" } : {}}
      className={styles.chatContainer}
    >
      {/* {!user ? (
        <div className={styles.imgContainer}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/64/64572.png"
            alt=""
          />
        </div>
      ) : (
        <></>
      )} */}
      <div className={`${styles.chat} ${user ? styles.user : ""}`}>
        {/* {!user ? (
          <div className={styles.header}>
            <div className={styles.name}>{chat.person}</div>
            <div className={styles.time}>
              {t.toUTCString().substring(17, 22)}
            </div>
          </div>
        ) : (
          <></>
        )} */}

        <div className={styles.text}>{chat.text}</div>

        <div className={styles.footer}>
          <div className={styles.time}>{t.toUTCString().substring(17, 22)}</div>
        </div>
      </div>
    </div>
  );
}
