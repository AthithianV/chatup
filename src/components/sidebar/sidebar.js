import { Outlet } from "react-router-dom";
import styles from "./sidebar.module.css";
import Conversation from "../conversation/conversation";
import { useEffect } from "react";
import {
  getConversations,
  conversationSelector,
} from "../../redux/reducers/conversationReducer";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/reducers/userReducer";
import SiderBarLoader from "../Spinner/siderbarLoader";
import SearchBar from "../SearchBar/searchBar";

export default function Sidebar() {
  const { user } = useSelector(userSelector);
  const { loader, conversations } = useSelector(conversationSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getConversations(user));
  }, []);

  return (
    <>
      <div className={styles.sidebar}>
        <SearchBar />
        <div className={styles.addWidget}>
          <h5 className={styles.title}>ADD CONVERSATION</h5>
          <button className={styles.addBtn}>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        {loader ? (
          <SiderBarLoader />
        ) : (
          conversations.map((c, index) => (
            <Conversation key={index} conversation={c} />
          ))
        )}
      </div>
      <Outlet />
    </>
  );
}
