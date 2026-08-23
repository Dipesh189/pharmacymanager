import { useEffect, useState } from "react";

import {
  NavLink,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { apiFetch } from "../../../services/stafftimesheet";

import TimeSheet from "../../../components/TimeSheet/TimeSheet";
import AddSop from "../AddSop/AddSop";

import styles from "./StaffDashboard.module.css";


type StaffDashboardProps = {
  onLogout: () => void;
};


type HolidaySummary = {
  holiday_allowance: number;
  holiday_taken: number;
  holiday_left: number;
  sick_taken: number;
  unpaid_taken: number;
};


const StaffDashboard = ({
  onLogout,
}: StaffDashboardProps) => {

  // =========================
  // LOGGED-IN USER
  // =========================

  const savedUser =
    localStorage.getItem("user");


  let firstName = "";
  let lastName = "";
  let position = "";
  let branchName = "";


  if (savedUser) {

    try {

      const user =
        JSON.parse(savedUser);


      firstName =
        user.first_name || "";

      lastName =
        user.last_name || "";

      position =
        user.position || "";

      branchName =
        user.branch_name || "";


    } catch (error) {

      console.error(
        "Unable to read user:",
        error
      );

    }

  }


  // =========================
  // HOLIDAY SUMMARY
  // =========================

  const [
    holidaySummary,
    setHolidaySummary
  ] = useState<HolidaySummary>({

    holiday_allowance: 28,

    holiday_taken: 0,

    holiday_left: 28,

    sick_taken: 0,

    unpaid_taken: 0,

  });


  // =========================
  // FETCH HOLIDAY SUMMARY
  // =========================

  useEffect(() => {

    const fetchHolidaySummary =
      async () => {

        try {

          const response =
            await apiFetch(
              "/staff/holiday/"
            );


          const data =
            await response.json();


          if (!response.ok) {

            console.error(
              "Holiday error:",
              data
            );

            return;
          }


          setHolidaySummary({

            holiday_allowance:
              data.holiday_allowance ?? 28,

            holiday_taken:
              data.holiday_taken ?? 0,

            holiday_left:
              data.holiday_left ?? 28,

            sick_taken:
              data.sick_taken ?? 0,

            unpaid_taken:
              data.unpaid_taken ?? 0,

          });


        } catch (error) {

          console.error(
            "Unable to load holiday summary:",
            error
          );

        }

      };


    fetchHolidaySummary();

  }, []);


  return (
    <>

      {/* =========================
          HEADER
         ========================= */}

      <header
        className={
          styles.staffHeader
        }
      >

        <div
          className={
            styles.staffDetails
          }
        >

          <h1>
            {firstName} {lastName}
          </h1>


          <div
            className={
              styles.staffMeta
            }
          >

            <span>
              {position || "Staff"}
            </span>


            <span
              className={
                styles.divider
              }
            >
              |
            </span>


            <span>
              {branchName || "Branch"}
            </span>

          </div>

        </div>


        <button
          type="button"
          className={
            styles.logoutButton
          }
          onClick={
            onLogout
          }
        >
          Logout
        </button>

      </header>


      {/* =========================
          NAVIGATION
         ========================= */}

      <nav
        className={
          styles.staffNavigation
        }
      >

        {/* HOLIDAY */}

        <NavLink
          to="/staff/holiday"
          className={
            styles.navButton
          }
        >

          <div>
            Holiday
          </div>


          <div>
            Taken {
              holidaySummary.holiday_taken
            } days

            {" | "}

            Left {
              holidaySummary.holiday_left
            } days
          </div>

        </NavLink>


        {/* SICK LEAVE */}

        <NavLink
          to="/staff/sick-leave"
          className={
            styles.navButton
          }
        >

          <div>
            Sick Leave
          </div>


          <div>
            Taken {
              holidaySummary.sick_taken
            } days
          </div>

        </NavLink>


        {/* EMERGENCY / UNPAID */}

        <NavLink
          to="/staff/emergency-leave"
          className={
            styles.navButton
          }
        >

          <div>
            Emergency Leave
          </div>


          <div>
            Taken {
              holidaySummary.unpaid_taken
            } days
          </div>

        </NavLink>


        {/* SOP */}

        <NavLink
          to="/staff/sop"
          className={
            styles.navButton
          }
        >
          SOP
        </NavLink>


        {/* CERTIFICATE */}

        <NavLink
          to="/staff/certificate"
          className={
            styles.navButton
          }
        >
          Certificate
        </NavLink>


        {/* ADD NOTE */}

        <NavLink
          to="/staff/add-note"
          className={
            styles.navButton
          }
        >
          Add Note
        </NavLink>


        {/* ADD SOP */}

        <NavLink
          to="/staff/addsop"
          className={
            styles.navButton
          }
        >
          Add Sop
        </NavLink>


        {/* STOCK */}

        <NavLink
          to="/staff/stock"
          className={
            styles.navButton
          }
        >
          Stock
        </NavLink>

      </nav>


      {/* =========================
          STAFF CONTENT
         ========================= */}

      <section
        className={
          styles.staffContainer
        }
      >

        <Routes>

          {/* DASHBOARD / TIMESHEET */}

          <Route
            path="dashboard"
            element={
              <TimeSheet />
            }
          />


          {/* ADD SOP */}

          <Route
            path="addsop"
            element={
              <AddSop />
            }
          />


          {/* UNKNOWN STAFF ROUTE */}

          <Route
            path="*"
            element={
              <Navigate
                to="/staff/dashboard"
                replace
              />
            }
          />

        </Routes>

      </section>

    </>
  );

};


export default StaffDashboard;