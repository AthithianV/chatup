import styles from "./chat.module.css";

export default function Chat({ user, chat }) {
  return (
    <div
      style={user ? { justifyContent: "end" } : {}}
      className={styles.chatContainer}
    >
      {!user ? (
        <div className={styles.imgContainer}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/64/64572.png"
            alt=""
          />
        </div>
      ) : (
        <></>
      )}
      <div className={`${styles.chat} ${user ? styles.user : ""}`}>
        {!user ? (
          <div className={styles.header}>
            <div className={styles.name}>{chat.person}</div>
            <div className={styles.time}>
              {new Date(chat.time).toUTCString().substring(17, 22)}
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className={styles.text}>{chat.text}</div>

        {user ? (
          <div className={styles.footer}>
            <div className={styles.time}>
              {new Date(chat.time).toUTCString().substring(17, 22)}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
