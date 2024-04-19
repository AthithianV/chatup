import { Outlet } from "react-router-dom";
import styles from "./sidebar.module.css";
import Conversation from "../conversation/conversation";
import { useEffect } from "react";
import {
  getConversations,
  sidebarSelector,
} from "../../redux/reducers/sidebarReducer";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/reducers/userReducer";
import SiderBarLoader from "../Spinner/siderbarLoader";
import SearchBar from "../SearchBar/searchBar";

export default function Sidebar() {
  const { user } = useSelector(userSelector);
  const { loader, conversations } = useSelector(sidebarSelector);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getConversations(user));
  }, []);

  return (
    <>
      <div className={styles.sidebar}>
        <SearchBar />
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
