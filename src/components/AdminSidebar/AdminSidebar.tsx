import {
  useState,
} from "react";

import {
  NavLink,
} from "react-router-dom";

import styles from "./AdminSidebar.module.css";


type AdminSidebarProps = {
  onLogout: () => void;
};


const Sidebar = ({
  onLogout,
}: AdminSidebarProps) => {

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);


  const getNavLinkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `${styles.navLink} ${
      isActive
        ? styles.active
        : ""
    }`;


  const closeSidebar = () => {
    setIsOpen(false);
  };


  return (
    <>

      {/* =========================
          MOBILE MENU BUTTON
         ========================= */}

      <button
        type="button"
        className={
          styles.mobileMenuButton
        }
        onClick={() =>
          setIsOpen(
            (current) => !current
          )
        }
        aria-label="Open navigation"
        aria-expanded={isOpen}
      >
        <span />
        <span />
        <span />
      </button>


      {/* =========================
          MOBILE OVERLAY
         ========================= */}

      {isOpen && (

        <div
          className={
            styles.sidebarOverlay
          }
          onClick={
            closeSidebar
          }
        />

      )}


      {/* =========================
          SIDEBAR
         ========================= */}

      <aside
        className={`
          ${styles.sidebar}
          ${
            isOpen
              ? styles.sidebarOpen
              : ""
          }
        `}
      >

        {/* =========================
            LOGO
           ========================= */}

        <div
          className={
            styles.logo
          }
        >

          <div
            className={
              styles.logoMark
            }
          >
            M
          </div>


          <span
            className={
              styles.logoText
            }
          >
            Makans Ltd
          </span>

        </div>


        {/* =========================
            NAVIGATION
           ========================= */}

        <nav
          className={
            styles.nav
          }
        >

          <NavLink
            to="/admin/branches"
            className={
              getNavLinkClass
            }
            onClick={
              closeSidebar
            }
          >
            <span
              className={
                styles.icon
              }
            >
              ▦
            </span>

            <span
              className={
                styles.linkText
              }
            >
              All Branch
            </span>
          </NavLink>


          <NavLink
            to="/admin/time-sheet"
            className={
              getNavLinkClass
            }
            onClick={
              closeSidebar
            }
          >
            <span
              className={
                styles.icon
              }
            >
              □
            </span>

            <span
              className={
                styles.linkText
              }
            >
              Time Sheet
            </span>
          </NavLink>


          <NavLink
            to="/admin/rp-rota"
            className={
              getNavLinkClass
            }
            onClick={
              closeSidebar
            }
          >
            <span
              className={
                styles.icon
              }
            >
              ▣
            </span>

            <span
              className={
                styles.linkText
              }
            >
              RP Rota
            </span>
          </NavLink>


          <NavLink
            to="/admin/rp-log"
            className={
              getNavLinkClass
            }
            onClick={
              closeSidebar
            }
          >
            <span
              className={
                styles.icon
              }
            >
              ▣
            </span>

            <span
              className={
                styles.linkText
              }
            >
              RP Log
            </span>
          </NavLink>


          <NavLink
            to="/admin/holidays"
            className={
              getNavLinkClass
            }
            onClick={
              closeSidebar
            }
          >
            <span
              className={
                styles.icon
              }
            >
              ♙
            </span>

            <span
              className={
                styles.linkText
              }
            >
              Holidays
            </span>
          </NavLink>


          <NavLink
            to="/admin/end-of-month"
            className={
              getNavLinkClass
            }
            onClick={
              closeSidebar
            }
          >
            <span
              className={
                styles.icon
              }
            >
              ▤
            </span>

            <span
              className={
                styles.linkText
              }
            >
              End Of Month
            </span>
          </NavLink>
          <NavLink
  to="/admin/appointments"
  className={getNavLinkClass}
  onClick={closeSidebar}
>
  <span className={styles.icon}>
    ◫
  </span>

  <span className={styles.linkText}>
    Appointments
  </span>
</NavLink>


          <NavLink
            to="/admin/settings"
            className={
              getNavLinkClass
            }
            onClick={
              closeSidebar
            }
          >
            <span
              className={
                styles.icon
              }
            >
              ⚙
            </span>

            <span
              className={
                styles.linkText
              }
            >
              Settings
            </span>
          </NavLink>

        </nav>


        {/* =========================
            LOGOUT
           ========================= */}

        <div
          className={
            styles.bottomSection
          }
        >

          <button
            type="button"
            className={
              `${styles.navLink} ${styles.logoutButton}`
            }
            onClick={() => {
              closeSidebar();
              onLogout();
            }}
          >
            <span
              className={
                styles.icon
              }
            >
              ↪
            </span>

            <span
              className={
                styles.linkText
              }
            >
              Logout
            </span>
          </button>

        </div>

      </aside>

    </>
  );

};


export default Sidebar;