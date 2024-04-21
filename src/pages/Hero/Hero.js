import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/724/724715.png"
            alt="Hero Pic"
          />
        </div>
        <h3>Connecting hearts, one message at a time.</h3>
      </div>
    </div>
  );
}
