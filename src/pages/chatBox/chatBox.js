import { useDispatch, useSelector } from "react-redux";
import Chat from "../../components/chat/chat";
import InputBox from "../../components/inputbox/inputbox";
import styles from "./chatbox.module.css";
import { chatSelector, loadChat } from "../../redux/reducers/chatReducer";
import { userSelector } from "../../redux/reducers/userReducer";
import { conversationSelector } from "../../redux/reducers/conversationReducer";
import { useEffect } from "react";

export default function ChatBox() {
  const dispatch = useDispatch();
  const { chats } = useSelector(chatSelector);
  const { current_conversation } = useSelector(conversationSelector);
  const { user } = useSelector(userSelector);

  useEffect(() => {
    if (current_conversation) {
      dispatch(loadChat(current_conversation.title));
    }
  }, [dispatch, current_conversation]);

  return (
    <div className={styles.chatbox}>
      {current_conversation ? (
        <>
          <div className={styles.header}>
            <div className={styles.imgContainer}>
              <img src={current_conversation.image} alt="Profile Image" />
            </div>
            <h2 className={styles.name}>{current_conversation.name}</h2>
          </div>
          <div className={styles.chatContainer}>
            {chats &&
              chats.map((chat, index) => {
                if (chat.person == user.name) {
                  return <Chat key={index} user={true} chat={chat} />;
                } else {
                  return <Chat key={index} chat={chat} />;
                }
              })}
          </div>
          <InputBox />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
