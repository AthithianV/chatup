import styles from "./conversation.module.css";
import { NavLink } from "react-router-dom";

export default function Conversation({ conversation }) {
  let t = new Date(conversation.lastActivityAt);
  let today = new Date();
  t.setHours(t.getHours() + 5);
  t.setMinutes(t.getMinutes() + 30);

  let time = "";

  if (t.getDate() < today.getDate()) {
    time = t.toUTCString().substring(5, 12);
  } else {
    time = t.toUTCString().substring(17, 22);
  }

  return (
    <NavLink
      to={conversation.title}
      style={({ isActive }) =>
        isActive ? { backgroundColor: "var(--theme)" } : null
      }
      className={styles.conversation}
    >
      <div className={styles.imgContainer}>
        <img src={conversation.image} alt="" />
      </div>
      <div className={styles.mid}>
        <h3 className={styles.title}>{conversation.name}</h3>
        <p className={styles.text}>{conversation.lastChat}</p>
      </div>
      <div className={styles.time}>{time}</div>
    </NavLink>
  );
}
