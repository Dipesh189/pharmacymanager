import style from "./NavbarStaffButton.module.css";
import { NavLink } from "react-router-dom";


type StatCardProps = {
  title: string;
};

type NavbarStaffButtonProps = {
  onLogout: () => void;
};


const StatCard = ({ title }: StatCardProps) => {

  const path = title
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <NavLink
      to={`/branch/${path}`}
      className={({ isActive }) =>
        `${style.navbarButtonBranchContainer} ${
          isActive ? style.active : ""
        }`
      }
    >
      {title}
      
    </NavLink>
  );
};


const NavbarStaffButton =  ({ onLogout }: NavbarStaffButtonProps)  => {
  return (
    <div className={style.navbarBranchContainer}>

      <div className={style.headingBranchContainer}>
        Navigation
      </div>

      <div className={style.navbarBodyBranchContainer}>

        <StatCard title="SOP" />
        <StatCard title="Order" />
        <StatCard title="Daily Services" />
        <StatCard title="End Of Month" />
        
       <button
          type="button"
          className={style.navbarButtonBranchContainer}
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
};

export default NavbarStaffButton;