import { useRef } from "react";
import styles from "./inputbox.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addChat } from "../../../redux/reducers/chatReducer";
import { userSelector } from "../../../redux/reducers/userReducer";
import { conversationSelector } from "../../../redux/reducers/conversationReducer";

export default function InputBox() {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { user } = useSelector(userSelector);
  const { current_conversation } = useSelector(conversationSelector);

  const submitForm = (e) => {
    e.preventDefault();
    if (inputRef.current.value.trim().length === 0) {
      return;
    }
    dispatch(
      addChat({
        text: inputRef.current.value,
        sender: { name: user.name },
        conversationId: current_conversation.id,
        key: current_conversation.encryptionKey,
      })
    );
    inputRef.current.value = "";
  };

  return (
    <form className={styles.inputbox} onSubmit={(e) => submitForm(e)}>
      <div className={styles.attachments}>
        <i className="fa-solid fa-paperclip"></i>
      </div>
      <input
        className={styles.input}
        type="text"
        placeholder="Type Your Message Here"
        ref={inputRef}
      />
      <button className={styles.btn} type="submit">
        Send
      </button>
    </form>
  );
}
