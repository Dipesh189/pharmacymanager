import type { ReactNode } from "react";

import Sidebar from "../../components/AdminSidebar/AdminSidebar";
import Header from "../../components/AdminHeader/AdminHeader";

import styles from "./ManagerDashboardLayout.module.css";

type DashboardLayoutProps = {
  children: ReactNode;
  onLogout: () => void;
};

const ManagerDashboardLayout = ({
  children,
  onLogout,
}: DashboardLayoutProps) => {
  return (
    <div className={styles.dashboardLayout}>
      <Sidebar onLogout={onLogout} />

      <div className={styles.dashboardMain}>
        <Header />

        <main className={styles.dashboardContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboardLayout;