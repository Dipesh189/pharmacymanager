import type { ReactNode } from "react";



import styles from "./StaffDashboardLayout.module.css";

type DashboardLayoutProps = {
  children: ReactNode;
};

const StaffDashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    
      

        <main className={styles.staffdashboardLayout}>
          {children}
        </main>
   
    
  );
};

export default StaffDashboardLayout;