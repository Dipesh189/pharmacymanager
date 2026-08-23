import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/login/Login";

import AdminDashboardLayout from "./layouts/AdminDashboardLayout/AdminDashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard/AdminDashboard";

import ManagerDashboardLayout from "./layouts/ManagerDashboardLayout/ManagerDashboardLayout";
import ManagerDashboard from "./pages/manager/ManagerDashboard/ManagerDashboard";

import StaffDashboardLayout from "./layouts/StaffDashboardLayout/StaffDashboardLayout";
import StaffDashboard from "./pages/staff/StaffDashboard/StaffDashboard";

import BranchDashboardLayout from "./layouts/BranchDashboardLayout/BranchDashboardLayout";
import BranchDashboard from "./pages/branch/BranchDashboard/BranchDashboard";

import { branchRoutes } from "./routes/branchRoutes";


type UserRole =
  | "admin"
  | "manager"
  | "staff"
  | "branch";


function App() {

  // =========================
  // USER ROLE
  // =========================

  const [userRole, setUserRole] =
    useState<UserRole | null>(() => {

      const accessToken =
        localStorage.getItem(
          "accessToken"
        );

      const savedUser =
        localStorage.getItem(
          "user"
        );


      if (
        !accessToken ||
        !savedUser
      ) {
        return null;
      }


      try {

        const user =
          JSON.parse(
            savedUser
          );


        const accessLevel =
          user.access_level
            ?.toLowerCase();


        if (
          accessLevel === "admin"
        ) {
          return "admin";
        }


        if (
          accessLevel === "manager"
        ) {
          return "manager";
        }


        if (
          accessLevel === "staff"
        ) {
          return "staff";
        }


        if (
          accessLevel === "branch"
        ) {
          return "branch";
        }


        return null;


      } catch {

        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        localStorage.removeItem(
          "user"
        );


        return null;

      }

    });


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    localStorage.removeItem(
      "user"
    );


    setUserRole(null);

  };


  return (

    <BrowserRouter>

      <Routes>


        {/* =========================
            LOGIN
           ========================= */}

        <Route
          path="/login"
          element={
            userRole === null ? (

              <Login
                onLoginSuccess={
                  (role) =>
                    setUserRole(
                      role
                    )
                }
              />

            ) : (

              <Navigate
                to={
                  userRole === "admin"

                    ? "/admin/dashboard"

                    : userRole === "manager"

                    ? "/manager/dashboard"

                    : userRole === "staff"

                    ? "/staff/dashboard"

                    : "/branch/dashboard"
                }
                replace
              />

            )
          }
        />


        {/* =========================
            ADMIN
           ========================= */}

        <Route
          path="/admin/dashboard"
          element={
            userRole === "admin" ? (

              <AdminDashboardLayout
                onLogout={
                  handleLogout
                }
              >

                <AdminDashboard />

              </AdminDashboardLayout>

            ) : (

              <Navigate
                to="/login"
                replace
              />

            )
          }
        />


        {/* =========================
            MANAGER
           ========================= */}

        <Route
          path="/manager/dashboard"
          element={
            userRole === "manager" ? (

              <ManagerDashboardLayout
                onLogout={
                  handleLogout
                }
              >

                <ManagerDashboard />

              </ManagerDashboardLayout>

            ) : (

              <Navigate
                to="/login"
                replace
              />

            )
          }
        />


        {/* =========================
            STAFF
           ========================= */}

        <Route
          path="/staff/*"
          element={
            userRole === "staff" ? (

              <StaffDashboardLayout>

                <StaffDashboard
                  onLogout={
                    handleLogout
                  }
                />

              </StaffDashboardLayout>

            ) : (

              <Navigate
                to="/login"
                replace
              />

            )
          }
        />


        {/* =========================
            BRANCH
           ========================= */}

        <Route
          path="/branch/*"
          element={
            userRole === "branch" ? (

              <BranchDashboardLayout>

                <Routes>


                  {/* BRANCH DASHBOARD */}

                  <Route
                    path="dashboard"
                    element={
                      <BranchDashboard
                        onLogout={
                          handleLogout
                        }
                      />
                    }
                  />


                  {/* BRANCH ROUTES */}

                  {
                    branchRoutes.map(
                      (route) => (

                        <Route
                          key={
                            route.path
                          }
                          path={
                            route.path
                          }
                          element={
                            route.element
                          }
                        />

                      )
                    )
                  }


                  {/* UNKNOWN BRANCH URL */}

                  <Route
                    path="*"
                    element={
                      <Navigate
                        to="/branch/dashboard"
                        replace
                      />
                    }
                  />


                </Routes>

              </BranchDashboardLayout>

            ) : (

              <Navigate
                to="/login"
                replace
              />

            )
          }
        />


        {/* =========================
            DEFAULT
           ========================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* =========================
            UNKNOWN URL
           ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


      </Routes>

    </BrowserRouter>

  );

}


export default App;