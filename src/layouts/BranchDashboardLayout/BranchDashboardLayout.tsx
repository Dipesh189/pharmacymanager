import type { ReactNode } from "react";

import styles from "./BranchDashboardLayout.module.css";


type DashboardLayoutProps = {
  children: ReactNode;
};


const BranchDashboardLayout = ({
  children,
}: DashboardLayoutProps) => {

  // Get logged-in user from localStorage
  const savedUser =
    localStorage.getItem("user");


  let branchName = "Branch";


  if (savedUser) {

    try {

      const user =
        JSON.parse(savedUser);

      branchName =
        user.branch_name || "Branch";

    } catch (error) {

      console.error(
        "Unable to read user:",
        error
      );

    }

  }


  return (

    <div className={styles.branchPage}>

      <header className={styles.header}>
        {branchName}
      </header>


      <main
        className={
          styles.branchdashboardLayout
        }
      >
        {children}
      </main>

    </div>

  );

};


export default BranchDashboardLayout;