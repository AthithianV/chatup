import { useDispatch, useSelector } from "react-redux";
import styles from "./AddConversation.module.css";
import {
  getContacts,
  userAction,
  userSelector,
} from "../../../redux/reducers/userReducer";
import { useEffect, useRef, useState } from "react";
import { addConversation } from "../../../redux/reducers/conversationReducer";

export default function AddConversation() {
  const { user, contacts } = useSelector(userSelector);
  const dispatch = useDispatch();
  const [contactsList, setContactList] = useState(contacts);
  const [userList, setUserList] = useState([]);
  const inputRef = useRef();

  const [newContact, setNewContact] = useState(false);

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
          <h2>{newContact ? "Add New Contact" : "New Conversation"}</h2>
          <button
            className={styles.close}
            onClick={() => dispatch(userAction.switchDisplayContact())}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {!newContact ? (
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
        ) : (
          <form className={styles.newContactForm}>
            <input type="text" placeholder="Search for a User" />
            <button type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        )}

        {!newContact ? (
          <button
            className={styles.newContact}
            onClick={() => setNewContact(true)}
          >
            <i className="fa-solid fa-plus"></i> New Contact
          </button>
        ) : (
          <></>
        )}

        <ul className={styles.list}>
          {contactsList.map((c, index) => (
            <li
              key={index}
              onClick={() => {
                dispatch(
                  addConversation({
                    user: { name: user.name, id: user.id, image: user.image },
                    friend: c,
                  })
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
