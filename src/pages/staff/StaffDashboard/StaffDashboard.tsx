import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { apiFetch } from "../../../services/stafftimesheet";

import styles from "./StaffDashboard.module.css";


type StaffDashboardProps = {
  onLogout: () => void;
};


type TimeSheetRecord = {
  id: number | string;
  date: string;
  time: string;
  break: string;
  total_time: string;
  status: [];
};


type TimeSheetTotals = {
  break: string;
  total_time: string;
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
  // MONTH / YEAR
  // =========================

  const today = new Date();


  const [month, setMonth] =
    useState(
      today.getMonth() + 1
    );


  const [year, setYear] =
    useState(
      today.getFullYear()
    );


  // =========================
  // TIMESHEET DATA
  // =========================

  const [records, setRecords] =
    useState<TimeSheetRecord[]>([]);


  const [totals, setTotals] =
    useState<TimeSheetTotals>({
      break: "00:00",
      total_time: "00:00",
    });


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
  // LOADING / ERROR
  // =========================

  const [isLoading, setIsLoading] =
    useState(false);


  const [error, setError] =
    useState("");


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


  // =========================
  // FETCH TIMESHEET
  // =========================

  useEffect(() => {

    const fetchTimeSheet =
      async () => {

        const accessToken =
          localStorage.getItem(
            "accessToken"
          );


        if (!accessToken) {
          return;
        }


        setIsLoading(true);

        setError("");


        try {

          const response =
            await apiFetch(
              `/staff/time-sheet/?month=${month}&year=${year}`
            );


          const data =
            await response.json();


          if (!response.ok) {

            setError(
              data.detail ||
              "Unable to load timesheet."
            );

            return;
          }


          setRecords(
            data.records || []
          );


          setTotals(
            data.totals || {
              break: "00:00",
              total_time: "00:00",
            }
          );


        } catch (error) {

          console.error(
            "Timesheet error:",
            error
          );


          setError(
            "Unable to connect to the server."
          );


        } finally {

          setIsLoading(false);

        }

      };


    fetchTimeSheet();

  }, [month, year]);


  // =========================
  // PREVIOUS MONTH
  // =========================

  const handlePreviousMonth = () => {

    if (month === 1) {

      setMonth(12);

      setYear(
        year - 1
      );

    } else {

      setMonth(
        month - 1
      );

    }

  };


  // =========================
  // NEXT MONTH
  // =========================

  const handleNextMonth = () => {

    if (month === 12) {

      setMonth(1);

      setYear(
        year + 1
      );

    } else {

      setMonth(
        month + 1
      );

    }

  };


  // =========================
  // MONTH NAME
  // =========================

  const monthName =
    new Date(
      year,
      month - 1
    ).toLocaleString(
      "en-GB",
      {
        month: "long",
      }
    );


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
          onClick={onLogout}
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
  Taken {holidaySummary.holiday_taken} days
  {" | "}
  Left {holidaySummary.holiday_left} days
</div>

        </NavLink>


        {/* SICK */}

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
              holidaySummary
                .sick_taken
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
              holidaySummary
                .unpaid_taken
            } days
          </div>

        </NavLink>


        <NavLink
          to="/staff/sop"
          className={
            styles.navButton
          }
        >
          SOP
        </NavLink>


        <NavLink
          to="/staff/certificate"
          className={
            styles.navButton
          }
        >
          Certificate
        </NavLink>


        <NavLink
          to="/staff/add-note"
          className={
            styles.navButton
          }
        >
          Add Note
        </NavLink>

      </nav>


      {/* =========================
          TIMESHEET
         ========================= */}

      <section
        className={
          styles.timesheet
        }
      >

        <div
          className={
            styles.timesheetHeader
          }
        >

          <div>

            <h2>
              Timesheet
            </h2>

            <p>
              Monthly attendance summary
            </p>

          </div>


          <div
            className={
              styles.monthNavigation
            }
          >

            <button
              type="button"
              className={
                styles.monthButton
              }
              onClick={
                handlePreviousMonth
              }
            >
              ‹
            </button>


            <div
              className={
                styles.monthYear
              }
            >
              {monthName} {year}
            </div>


            <button
              type="button"
              className={
                styles.monthButton
              }
              onClick={
                handleNextMonth
              }
            >
              ›
            </button>

          </div>

        </div>


        {isLoading && (

          <div
            className={
              styles.tableMessage
            }
          >
            Loading timesheet...
          </div>

        )}


        {error && (

          <div
            className={
              styles.tableError
            }
          >
            {error}
          </div>

        )}


        {!isLoading && !error && (

          <div
            className={
              styles.tableContainer
            }
          >

            <table
              className={
                styles.timesheetTable
              }
            >

              <thead>

                <tr>

                  <th>
                    Date
                  </th>

                  <th>
                    Time
                  </th>

                  <th>
                    Break
                  </th>

                  <th>
                    Total Time
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {records.length > 0 ? (

                  records.map(
                    (record) => (

                      <tr
                        key={
                          record.id
                        }
                      >

                        <td>
                          {record.date}
                        </td>


                        <td>
                          {record.time}
                        </td>


                        <td>
                          {record.break}
                        </td>


                        <td>
                          {
                            record.total_time
                          }
                        </td>


                        <td>
  {record.status.map((status) => (

    <span
      key={status}
      className={
        status === "Sick"
          ? styles.statusSick

          : status === "Holiday"
          ? styles.statusHoliday

          : styles.statusDefault
      }
    >
      {status}
    </span>

  ))}
</td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan={5}
                      className={
                        styles.noRecords
                      }
                    >
                      No attendance records
                      for this month.
                    </td>

                  </tr>

                )}


                <tr
                  className={
                    styles.totalRow
                  }
                >

                  <td>
                    Total
                  </td>

                  <td></td>


                  <td>
                    {totals.break}
                  </td>


                  <td>
                    {totals.total_time}
                  </td>


                  <td></td>

                </tr>

              </tbody>

            </table>

          </div>

        )}

      </section>

    </>
  );

};


export default StaffDashboard;