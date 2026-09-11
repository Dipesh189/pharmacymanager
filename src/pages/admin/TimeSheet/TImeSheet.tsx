import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  apiFetch,
} from "../../../services/stafftimesheet";

import styles from "./TimeSheet.module.css";


type StaffOption = {
  staff_id?: number | string;
  name: string;
};


type BranchOption = {
  branch: string;
  children: StaffOption[];
};


type TimeSheetRecord = {
  id: number | string;
  date: string;
  day: string;
  branch_name: string;
  branch_names?: string[];
  time: string;
  break: string;
  study?: string;
  total_time: string;
  status: string[];
};


type TimeSheetTotals = {
  break: string;
  study?: string;
  total_time: string;
};


type StaffDetails = {
  staff_id: number | string;
  first_name: string;
  last_name: string;
  position?: string;
  branch_name: string;
};


const AdminTimeSheet = () => {

  const today = new Date();


  const [
    branches,
    setBranches,
  ] = useState<BranchOption[]>([]);


  const [
    selectedBranch,
    setSelectedBranch,
  ] = useState("");


  const [
    selectedStaff,
    setSelectedStaff,
  ] = useState("");


  const [
    month,
    setMonth,
  ] = useState(
    today.getMonth() + 1
  );


  const [
    year,
    setYear,
  ] = useState(
    today.getFullYear()
  );


  const [
    records,
    setRecords,
  ] = useState<TimeSheetRecord[]>([]);


  const [
    totals,
    setTotals,
  ] = useState<TimeSheetTotals>({
    break: "00:00",
    study: "00:00",
    total_time: "00:00",
  });


  const [
    staffDetails,
    setStaffDetails,
  ] = useState<StaffDetails | null>(
    null
  );


  const [
    isLoadingOptions,
    setIsLoadingOptions,
  ] = useState(false);


  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  // =========================
  // STAFF FOR SELECTED BRANCH
  // =========================

  const staffOptions = useMemo(() => {

    const selectedBranchData =
      branches.find(
        (branch) =>
          branch.branch ===
          selectedBranch
      );


    return (
      selectedBranchData
        ?.children || []
    );

  }, [
    branches,
    selectedBranch,
  ]);


  // =========================
  // FETCH BRANCHES AND STAFF
  // =========================

  useEffect(() => {

    const fetchBranchesAndStaff =
      async () => {

        setIsLoadingOptions(true);
        setError("");


        try {

          const response =
            await apiFetch(
              "/get-single-data/branch/?staff=staff"
            );


          const data =
            await response.json();


          if (!response.ok) {

            setError(
              data.detail ||
              "Unable to load branches and staff."
            );

            return;

          }


          if (!Array.isArray(data)) {

            setError(
              "Invalid branch and staff response."
            );

            return;

          }


          setBranches(data);

        } catch (fetchError) {

          console.error(
            "Branch and staff error:",
            fetchError
          );


          setError(
            "Unable to connect to the server."
          );

        } finally {

          setIsLoadingOptions(false);

        }

      };


    fetchBranchesAndStaff();

  }, []);


  // =========================
  // FETCH SELECTED TIMESHEET
  // =========================

  useEffect(() => {

    if (!selectedStaff) {

      setRecords([]);

      setStaffDetails(null);

      setTotals({
        break: "00:00",
        study: "00:00",
        total_time: "00:00",
      });

      return;

    }


    const fetchTimeSheet =
      async () => {

        setIsLoading(true);
        setError("");


        try {

          const query =
            new URLSearchParams({
              staff_name:
                selectedStaff,

              month:
                String(month),

              year:
                String(year),
            });


          const response =
            await apiFetch(
              `/admin/time-sheet/?${query.toString()}`
            );


          const data =
            await response.json();


          if (!response.ok) {

            setError(
              data.detail ||
              "Unable to load timesheet."
            );

            setRecords([]);

            setStaffDetails(null);

            return;

          }


          setRecords(
            Array.isArray(data.records)
              ? data.records
              : []
          );


          setTotals(
            data.totals || {
              break: "00:00",
              study: "00:00",
              total_time: "00:00",
            }
          );


          setStaffDetails(
            data.staff || null
          );

        } catch (fetchError) {

          console.error(
            "Timesheet error:",
            fetchError
          );


          setError(
            "Unable to connect to the server."
          );

          setRecords([]);
          setStaffDetails(null);

        } finally {

          setIsLoading(false);

        }

      };


    fetchTimeSheet();

  }, [
    selectedStaff,
    month,
    year,
  ]);


  // =========================
  // CHANGE BRANCH
  // =========================

  const handleBranchChange = (
    event:
      React.ChangeEvent<HTMLSelectElement>
  ) => {

    setSelectedBranch(
      event.target.value
    );

    setSelectedStaff("");
    setRecords([]);
    setStaffDetails(null);
    setError("");

  };


  // =========================
  // CHANGE STAFF
  // =========================

  const handleStaffChange = (
    event:
      React.ChangeEvent<HTMLSelectElement>
  ) => {

    setSelectedStaff(
      event.target.value
    );

    setRecords([]);
    setStaffDetails(null);
    setError("");

  };


  // =========================
  // PREVIOUS MONTH
  // =========================

  const handlePreviousMonth = () => {

    if (month === 1) {

      setMonth(12);

      setYear(
        (currentYear) =>
          currentYear - 1
      );

    } else {

      setMonth(
        (currentMonth) =>
          currentMonth - 1
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
        (currentYear) =>
          currentYear + 1
      );

    } else {

      setMonth(
        (currentMonth) =>
          currentMonth + 1
      );

    }

  };


  // =========================
  // MONTH NAME
  // =========================

  const monthName = new Date(
    year,
    month - 1
  ).toLocaleString(
    "en-GB",
    {
      month: "long",
    }
  );


  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (
    status: string
  ) => {

    if (status === "Sick") {
      return styles.statusSick;
    }


    if (status === "Holiday") {
      return styles.statusHoliday;
    }


    return styles.statusDefault;

  };


  return (
    <>

      {/* =========================
          HEADER
         ========================= */}

      <div
        className={
          styles.timesheetHeader
        }
      >

        <div>

          <h2>
            Staff Timesheet
          </h2>

          <p>
            View monthly staff attendance
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
            aria-label="Previous month"
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
            aria-label="Next month"
          >
            ›
          </button>

        </div>

      </div>


      {/* =========================
          FILTERS
         ========================= */}

      <div
        className={
          styles.filters
        }
      >

        <div
          className={
            styles.filterGroup
          }
        >

          <label htmlFor="branch">
            Branch
          </label>


          <select
            id="branch"
            value={
              selectedBranch
            }
            onChange={
              handleBranchChange
            }
            disabled={
              isLoadingOptions
            }
          >

            <option value="">
              {
                isLoadingOptions
                  ? "Loading branches..."
                  : "Select branch"
              }
            </option>


            {branches.map(
              (branch) => (

                <option
                  key={
                    branch.branch
                  }
                  value={
                    branch.branch
                  }
                >
                  {branch.branch}
                </option>

              )
            )}

          </select>

        </div>


        <div
          className={
            styles.filterGroup
          }
        >

          <label htmlFor="staff">
            Staff member
          </label>


          <select
            id="staff"
            value={
              selectedStaff
            }
            onChange={
              handleStaffChange
            }
            disabled={
              !selectedBranch ||
              isLoadingOptions
            }
          >

            <option value="">
              {
                selectedBranch
                  ? "Select staff member"
                  : "Select branch first"
              }
            </option>


            {staffOptions.map(
              (staff) => (

                <option
                  key={
                    staff.staff_id ??
                    staff.name
                  }
                  value={
                    staff.name
                  }
                >
                  {staff.name}
                </option>

              )
            )}

          </select>

        </div>

      </div>


      {/* =========================
          STAFF SUMMARY
         ========================= */}

      {staffDetails && (

        <div
          className={
            styles.staffSummary
          }
        >

          <strong>
            {staffDetails.first_name}
            {" "}
            {staffDetails.last_name}
          </strong>


          <span>
            Home branch:{" "}
            {staffDetails.branch_name}
          </span>


          {staffDetails.position && (

            <span>
              {staffDetails.position}
            </span>

          )}

        </div>

      )}


      {/* =========================
          LOADING
         ========================= */}

      {isLoading && (

        <div
          className={
            styles.tableMessage
          }
        >
          Loading timesheet...
        </div>

      )}


      {/* =========================
          ERROR
         ========================= */}

      {error && (

        <div
          className={
            styles.tableError
          }
        >
          {error}
        </div>

      )}


      {/* =========================
          NO STAFF SELECTED
         ========================= */}

      {
        !selectedStaff &&
        !isLoading &&
        !error && (

          <div
            className={
              styles.tableMessage
            }
          >
            Select a branch and staff member.
          </div>

        )
      }


      {/* =========================
          TIMESHEET TABLE
         ========================= */}

      {
        selectedStaff &&
        !isLoading &&
        !error && (

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
                    Day
                  </th>

                  <th>
                    Branch
                  </th>

                  <th>
                    Time
                  </th>

                  <th>
                    Break
                  </th>

                  <th>
                    Study
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
                          {record.day || "-"}
                        </td>


                        <td>
                          {
                            record.branch_name ||
                            "-"
                          }
                        </td>


                        <td>
                          {record.time}
                        </td>


                        <td>
                          {record.break}
                        </td>


                        <td>
                          {
                            record.study ||
                            "-"
                          }
                        </td>


                        <td>
                          {record.total_time}
                        </td>


                        <td>

                          {
                            record.status.length >
                            0 ? (

                              record.status.map(
                                (status) => (

                                  <span
                                    key={
                                      status
                                    }
                                    className={
                                      getStatusClass(
                                        status
                                      )
                                    }
                                  >
                                    {status}
                                  </span>

                                )
                              )

                            ) : (

                              <span>
                                -
                              </span>

                            )
                          }

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan={8}
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

                  <td></td>

                  <td></td>

                  <td>
                    {totals.break}
                  </td>

                  <td>
                    {
                      totals.study ||
                      "00:00"
                    }
                  </td>

                  <td>
                    {totals.total_time}
                  </td>

                  <td></td>

                </tr>

              </tbody>

            </table>

          </div>

        )
      }

    </>
  );

};


export default AdminTimeSheet;