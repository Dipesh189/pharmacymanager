import styles from "./AdminHeader.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuButton} aria-label="Open menu">
          ☰
        </button>

        <div>
          <h2 className={styles.title}>Dashboard</h2>
          <p className={styles.subtitle}>Makans Ltd</p>
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.iconButton} aria-label="Notifications">
          🔔
        </button>

        <div className={styles.profile}>
          <div className={styles.avatar}>A</div>

          <div className={styles.profileText}>
            <span className={styles.name}>Admin</span>
            <span className={styles.role}>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;