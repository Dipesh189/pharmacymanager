import { NavLink } from "react-router-dom";

import styles from "./AdminSidebar.module.css";

type AdminSidebarProps = {
  onLogout: () => void;
};

const Sidebar = ({
  onLogout,
}: AdminSidebarProps) => {
  const getNavLinkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `${styles.navLink} ${
      isActive ? styles.active : ""
    }`;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>
          M
        </div>

        <span className={styles.logoText}>
          Makans Ltd
        </span>
      </div>

      <nav className={styles.nav}>
        <NavLink
          to="/admin/branches"
          className={getNavLinkClass}
        >
          <span className={styles.icon}>
            ▦
          </span>

          <span className={styles.linkText}>
            All Branch
          </span>
        </NavLink>

        <NavLink
          to="/admin/time-sheet"
          className={getNavLinkClass}
        >
          <span className={styles.icon}>
            □
          </span>

          <span className={styles.linkText}>
            Time Sheet
          </span>
        </NavLink>

        <NavLink
          to="/admin/rp-rota"
          className={getNavLinkClass}
        >
          <span className={styles.icon}>
            ▣
          </span>

          <span className={styles.linkText}>
            RP Rota
          </span>
        </NavLink>

        <NavLink
          to="/admin/rp-log"
          className={getNavLinkClass}
        >
          <span className={styles.icon}>
            ▣
          </span>

          <span className={styles.linkText}>
            RP Log
          </span>
        </NavLink>

        <NavLink
          to="/admin/holidays"
          className={getNavLinkClass}
        >
          <span className={styles.icon}>
            ♙
          </span>

          <span className={styles.linkText}>
            Holidays
          </span>
        </NavLink>

        <NavLink
          to="/admin/end-of-month"
          className={getNavLinkClass}
        >
          <span className={styles.icon}>
            ▤
          </span>

          <span className={styles.linkText}>
            End Of Month
          </span>
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={getNavLinkClass}
        >
          <span className={styles.icon}>
            ⚙
          </span>

          <span className={styles.linkText}>
            Settings
          </span>
        </NavLink>
      </nav>

      <div className={styles.bottomSection}>
        <button
          type="button"
          className={styles.navLink}
          onClick={onLogout}
        >
          <span className={styles.icon}>
            ↪
          </span>

          <span className={styles.linkText}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;