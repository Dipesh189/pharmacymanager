import styles from "./AdminSidebar.module.css";

type AdminSidebarProps = {
  onLogout: () => void;
};

const Sidebar = ({
  onLogout,
}: AdminSidebarProps) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>M</div>
        <span className={styles.logoText}>
          Makans Ltd
        </span>
      </div>

      <nav className={styles.nav}>
        <a
          href="#"
          className={`${styles.navLink} ${styles.active}`}
        >
          <span className={styles.icon}>▦</span>
          <span className={styles.linkText}>
            All Branch
          </span>
        </a>

        <a
          href="#"
          className={styles.navLink}
        >
          <span className={styles.icon}>□</span>
          <span className={styles.linkText}>
            Time Sheet
          </span>
        </a>

        <a
          href="#"
          className={styles.navLink}
        >
          <span className={styles.icon}>▣</span>
          <span className={styles.linkText}>
            RP Rota
          </span>
        </a>

        <a
          href="#"
          className={styles.navLink}
        >
          <span className={styles.icon}>▣</span>
          <span className={styles.linkText}>
            RP Log
          </span>
        </a>

        <a
          href="#"
          className={styles.navLink}
        >
          <span className={styles.icon}>♙</span>
          <span className={styles.linkText}>
            Holidays
          </span>
        </a>

        <a
          href="#"
          className={styles.navLink}
        >
          <span className={styles.icon}>▤</span>
          <span className={styles.linkText}>
            End Of Month
          </span>
        </a>

        <a
          href="#"
          className={styles.navLink}
        >
          <span className={styles.icon}>⚙</span>
          <span className={styles.linkText}>
            Settings
          </span>
        </a>
      </nav>

      <div className={styles.bottomSection} onClick={onLogout}>
        
         <div
  className={styles.bottomSection}
  onClick={onLogout}
>
  <div className={styles.navLink}>
    <span className={styles.icon}>↪</span>

    <span className={styles.linkText}>
      Logout
    </span>
  </div>
</div>
        
      </div>
    </aside>
  );
};

export default Sidebar;