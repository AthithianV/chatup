import styles from "./searchBar.module.css";

export default function SearchBar() {
  return (
    <form className={styles.search}>
      <button className={styles.searchBtn} type="submit">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search for Conversation"
      />
    </form>
  );
}
