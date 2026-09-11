import {
  useEffect,
  useState,
} from "react";

import {
  NavLink,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { apiFetch } from "../../../services/stafftimesheet";

import TimeSheet from "../../../components/TimeSheet/TimeSheet";
import AddSop from "../AddSop/AddSop";
import Sop from "../SOP/Sop";
import SopView from "../SOP/SopView";
import Holiday from "../Holiday/Holiday";
import SickLeave from "../SickLeave/SickLeave";

import styles from "./StaffDashboard.module.css";
import EmergencyLeave from "../EmergencyLeave/EmergencyLeave";
import AddNote from "../AddNote/AddNote";


type StaffDashboardProps = {
  onLogout: () => void;
};


type HolidaySummary = {
  holiday_taken: number;
  holiday_left: number;
  holiday_hours: string;
  holiday_hours_left: string;

  sick_taken: number;
  sick_hours: string;

  unpaid_taken: number;
  unpaid_hours: string;
};


type SavedUser = {
  first_name?: string;
  last_name?: string;
  position?: string;
  branch_name?: string;
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

      const user: SavedUser =
        JSON.parse(
          savedUser
        );


      firstName =
        user.first_name ?? "";


      lastName =
        user.last_name ?? "";


      position =
        user.position ?? "";


      branchName =
        user.branch_name ?? "";


    } catch (error) {

      console.error(
        "Unable to read user:",
        error
      );

    }

  }


  // =========================
  // ADD SOP PERMISSION
  // =========================

  const canAddSop = [
    "arti-kiren",
    "dipeshkumar",
  ].includes(
    firstName
      .trim()
      .toLowerCase()
  );


  // =========================
  // HOLIDAY SUMMARY
  // =========================

  const [
    holidaySummary,
    setHolidaySummary,
  ] = useState<HolidaySummary>({

    holiday_taken: 0,
    holiday_left: 0,

    holiday_hours:
      "00:00",

    holiday_hours_left:
      "00:00",

    sick_taken: 0,

    sick_hours:
      "00:00",

    unpaid_taken: 0,

    unpaid_hours:
      "00:00",

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
              "/staff/holiday/",
              {
                method: "GET",
              }
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

            holiday_taken:
              data.holiday_taken ??
              0,

            holiday_left:
              data.holiday_left ??
              0,

            holiday_hours:
              data.holiday_hours ??
              "00:00",

            holiday_hours_left:
              data.holiday_hours_left ??
              "00:00",

            sick_taken:
              data.sick_taken ??
              0,

            sick_hours:
              data.sick_hours ??
              "00:00",

            unpaid_taken:
              data.unpaid_taken ??
              0,

            unpaid_hours:
              data.unpaid_hours ??
              "00:00",

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

  const handleStudy = async () => {
  try {
    const response = await apiFetch(
      "/study-time-stamp/",
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(
        data.detail ||
        "Unable to record study time."
      );

      return;
    }

    console.log(
      "Study:",
      data
    );

    alert(
      data.detail ||
      "Study time recorded successfully."
    );

  } catch (error) {
    console.error(
      "Study time error:",
      error
    );

    alert(
      "Unable to record study time."
    );
  }
};


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

        {/* =========================
            HOLIDAY
           ========================= */}

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

            Taken{" "}

            {
              holidaySummary
                .holiday_taken
            }{" "}

            days |{" "}

            {
              holidaySummary
                .holiday_hours
            }{" "}

            hours

          </div>


          <div>

            Left{" "}

            {
              holidaySummary
                .holiday_left
            }{" "}

            days |{" "}

            {
              holidaySummary
                .holiday_hours_left
            }{" "}

            hours

          </div>

        </NavLink>


        {/* =========================
            SICK LEAVE
           ========================= */}

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

            Taken{" "}

            {
              holidaySummary
                .sick_taken
            }{" "}

            days |{" "}

            {
              holidaySummary
                .sick_hours
            }{" "}

            hours

          </div>

        </NavLink>


        {/* =========================
            EMERGENCY / UNPAID
           ========================= */}

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

            Taken{" "}

            {
              holidaySummary
                .unpaid_taken
            }{" "}

            days |{" "}

            {
              holidaySummary
                .unpaid_hours
            }{" "}

            hours

          </div>

        </NavLink>


        {/* =========================
            SOP
           ========================= */}

        <NavLink
          to="/staff/sop"
          className={
            styles.navButton
          }
        >
          SOP
        </NavLink>


        {/* =========================
            CERTIFICATE
           ========================= */}

        <NavLink
          to="/staff/certificate"
          className={
            styles.navButton
          }
        >
          Certificate
        </NavLink>


        {/* =========================
            ADD NOTE
           ========================= */}

        <NavLink
          to="/staff/add-note"
          className={
            styles.navButton
          }
        >
          Add Note
        </NavLink>


        {/* =========================
            ADD SOP
           ========================= */}

        {
          canAddSop && (

            <NavLink
              to="/staff/addsop"
              className={
                styles.navButton
              }
            >
              Add Sop
            </NavLink>

          )
        }


        {/* =========================
            STOCK
           ========================= */}

        <NavLink
          to="/staff/stock"
          className={
            styles.navButton
          }
        >
          Stock
        </NavLink>
        <div
  className={styles.navButton}
  onClick={handleStudy}
>
  Study
</div>

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

          {/* DASHBOARD */}

          <Route
            path="dashboard"
            element={
              <TimeSheet />
            }
          />


          {/* SOP LIST */}

          <Route
            path="sop"
            element={
              <Sop />
            }
          />


          {/* SINGLE SOP */}

          <Route
            path="sop/:sopId"
            element={
              <SopView />
            }
          />


          {/* HOLIDAY */}

          <Route
            path="holiday"
            element={
              <Holiday />
            }
          />


          {/* SICK LEAVE */}

          <Route
            path="sick-leave"
            element={
              <SickLeave />
            }
          />
          <Route 
            path="emergency-leave"
            element={
              <EmergencyLeave />
            }
          />
          <Route 
            path="add-note"
            element={
              <AddNote />
            }
          />

          {/* ADD SOP */}

          <Route
            path="addsop"
            element={
              canAddSop ? (

                <AddSop />

              ) : (

                <Navigate
                  to="/staff/dashboard"
                  replace
                />

              )
            }
          />


          {/* UNKNOWN ROUTE */}

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