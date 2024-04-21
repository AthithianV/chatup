import { Outlet } from "react-router-dom";
import styles from "./sidebar.module.css";
import Conversation from "../conversation/conversation";
import { useEffect, useRef, useState } from "react";
import {
  getConversations,
  conversationSelector,
} from "../../redux/reducers/conversationReducer";
import { useDispatch, useSelector } from "react-redux";
import { userAction, userSelector } from "../../redux/reducers/userReducer";
import SiderBarLoader from "../Spinner/siderbarLoader";
import AddConversation from "../AddConversation/AddConversation";

export default function Sidebar() {
  const { user, displayContact, current_conversation } =
    useSelector(userSelector);
  const { loader, conversations } = useSelector(conversationSelector);

  const [modifyConversation, setModifiedConversation] = useState();
  const dispatch = useDispatch();
  const inputRef = useRef();

  useEffect(() => {
    dispatch(getConversations(user));
  }, [dispatch, user, current_conversation]);

  useEffect(() => {
    const temp = [...conversations];
    setModifiedConversation(
      temp.sort((a, b) => b.lastActivityAt - a.lastActivityAt)
    );
  }, [conversations]);

  return (
    <>
      {displayContact && <AddConversation />}
      <div className={styles.sidebar}>
        <form
          className={styles.search}
          onSubmit={(e) => {
            e.preventDefault();
            setModifiedConversation(
              conversations.filter((c) => c.includes(inputRef.current.value))
            );
          }}
        >
          <button className={styles.searchBtn} type="submit">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <input
            ref={inputRef}
            onChange={() => {
              console.log(inputRef.current.value);
              setModifiedConversation(
                conversations.filter((c) =>
                  c.name.includes(inputRef.current.value)
                )
              );
            }}
            className={styles.searchInput}
            type="text"
            placeholder="Search for Conversation"
          />
        </form>

        <div className={styles.addWidget}>
          <h5 className={styles.title}>ADD CONVERSATION</h5>
          <button
            className={styles.addBtn}
            onClick={() => dispatch(userAction.switchDisplayContact())}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        <div className={styles.conversationContainer}>
          {loader ? (
            <SiderBarLoader />
          ) : (
            modifyConversation &&
            modifyConversation.map((c, index) => (
              <Conversation key={index} conversation={c} />
            ))
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}
