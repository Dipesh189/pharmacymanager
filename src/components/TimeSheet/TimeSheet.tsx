import styles from "./TimeSheet.module.css"
import { useEffect, useState } from "react";


import { apiFetch } from "../../services/stafftimesheet";

const TimeSheet = () => {
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

  // =========================
  // LOADING / ERROR
  // =========================

  const [isLoading, setIsLoading] =
    useState(false);


  const [error, setError] =
    useState("");
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

        )}</>
  )
}

export default TimeSheet