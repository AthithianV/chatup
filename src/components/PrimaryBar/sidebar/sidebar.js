import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import Cookies from "js-cookie";

import styles from "./sidebar.module.css";
import Conversation from "../conversation/conversation";
import {
  getConversations,
  conversationSelector,
} from "../../../redux/reducers/conversationReducer";
import { userAction, userSelector } from "../../../redux/reducers/userReducer";
import AddConversation from "../AddConversation/AddConversation";

export default function Sidebar() {
  const { user, displayContact } = useSelector(userSelector);
  const { loader, conversations, current_conversation } =
    useSelector(conversationSelector);

  const [modifyConversation, setModifiedConversation] = useState();
  const dispatch = useDispatch();
  const inputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const userId = Cookies.get("userId");
      if (userId) {
        dispatch(userAction.setUser(userId));
      } else {
        navigate("/user");
      }
    }
  }, [navigate, user, dispatch]);

  useEffect(() => {
    if (current_conversation) navigate("/" + current_conversation.id);
  }, [current_conversation, navigate]);

  useEffect(() => {
    if (user) dispatch(getConversations(user));
  }, [dispatch, user, current_conversation]);

  useEffect(() => {
    if (conversations) {
      const temp = [...conversations];
      setModifiedConversation(
        temp.sort((a, b) => b.lastActivityAt - a.lastActivityAt)
      );
    }
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
            <BeatLoader size={25} color={"black"} />
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
