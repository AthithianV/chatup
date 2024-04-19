import styles from "./conversation.module.css";

export default function Conversation({ conversation }) {
  return (
    <div className={styles.conversation}>
      <div className={styles.imgContainer}>
        <img src={conversation.image} alt="" />
      </div>
      <div className={styles.mid}>
        <h3 className={styles.title}>{conversation.name}</h3>
        <p className={styles.text}>{conversation.lastChat}</p>
      </div>
      <div className={styles.time}>
        {new Date(conversation.lastActivityAt).toUTCString().substring(6, 12)}
      </div>
    </div>
  );
}
