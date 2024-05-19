import styles from "./User.module.css";
import { Outlet } from "react-router-dom";

export default function User() {
  return (
    <div className={styles.formPage}>
      <div className={styles.left}>
        <img
          src="https://img.freepik.com/free-vector/conversation-concept-illustration_114360-1305.jpg?w=740&t=st=1713245541~exp=1713246141~hmac=42b809c89e74c0cdd450086df1d2152134371097307814a58380915ddc19d6ea"
          alt="Chat"
        />
      </div>
      <Outlet />
    </div> 
  );
}
