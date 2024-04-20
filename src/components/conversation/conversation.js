import { useDispatch, useSelector } from "react-redux";
import styles from "./conversation.module.css";
import {
  conversationActions,
  conversationSelector,
} from "../../redux/reducers/conversationReducer";

export default function Conversation({ conversation }) {
  const dispatch = useDispatch();
  const { current_conversation } = useSelector(conversationSelector);

  return (
    <div
      onClick={() => {
        dispatch(conversationActions.setConverstion(conversation));
      }}
      className={`${styles.conversation} ${
        current_conversation &&
        current_conversation.title === conversation.title
          ? styles.selected
          : ""
      }`}
    >
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
