import { useDispatch, useSelector } from "react-redux";
import styles from "./AddConversation.module.css";
import {
  getContacts,
  userAction,
  userSelector,
} from "../../redux/reducers/userReducer";
import { useEffect, useRef, useState } from "react";
import { addConversation } from "../../redux/reducers/conversationReducer";

export default function AddConversation() {
  const { user, contacts } = useSelector(userSelector);
  const dispatch = useDispatch();
  const [contactsList, setContactList] = useState(contacts);
  const inputRef = useRef();

  useEffect(() => {
    setContactList(contacts);
  }, [contacts]);

  useEffect(() => {
    dispatch(getContacts(user));
  }, [dispatch, user]);

  return (
    <div className={styles.container}>
      <div className={styles.contacts}>
        <div className={styles.header}>
          <h2>New Conversation</h2>
          <button
            className={styles.close}
            onClick={() => dispatch(userAction.switchDisplayContact())}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <input
          type="text"
          ref={inputRef}
          placeholder="Search for a contact"
          onChange={(e) => {
            setContactList(
              contacts.filter((c) => c.name.includes(e.target.value))
            );
          }}
        />
        <ul className={styles.list}>
          {contactsList.map((c, index) => (
            <li
              key={index}
              onClick={() => {
                dispatch(
                  addConversation({ user, friend: { name: c.name, id: c.id } })
                );
                dispatch(userAction.switchDisplayContact());
              }}
            >
              <div className={styles.imgContainer}>
                <img src={c.image} alt="profile pic" />
              </div>
              <span>{c.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
