import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  apiFetch,
} from "../../../services/stafftimesheet";

import styles from "./AdminAppointment.module.css";


type Summary = {
  total: number;
  confirmed: number;
  completed: number;
  rejected: number;
  paid: number;
  unpaid: number;
};


type StatusChartItem = {
  name: string;
  value: number;
};


type BranchChartItem = {
  branch: string;
  total: number;
  confirmed: number;
  completed: number;
  rejected: number;
  paid: number;
};


type ServiceChartItem = {
  service: string;
  total: number;
};


type DailyChartItem = {
  date: string;
  day: string;
  day_name: string;
  total: number;
};


type AppointmentStatistics = {
  filters: {
    month: number;
    year: number;
    branch: string;
  };

  summary: Summary;
  status_chart: StatusChartItem[];
  branch_chart: BranchChartItem[];
  service_chart: ServiceChartItem[];
  daily_chart: DailyChartItem[];
  branches: string[];
};


const emptySummary: Summary = {
  total: 0,
  confirmed: 0,
  completed: 0,
  rejected: 0,
  paid: 0,
  unpaid: 0,
};


const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


const AdminAppointment = () => {

  const today = new Date();


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
    selectedBranch,
    setSelectedBranch,
  ] = useState("");


  const [
    data,
    setData,
  ] = useState<AppointmentStatistics | null>(
    null
  );


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const years = useMemo(
    () =>
      Array.from(
        { length: 7 },
        (_, index) =>
          today.getFullYear() -
          3 +
          index
      ),
    []
  );


  // =========================
  // FETCH STATISTICS
  // =========================

  useEffect(() => {

    const controller =
      new AbortController();


    const fetchStatistics =
      async () => {

        setIsLoading(true);
        setError("");


        try {

          const query =
            new URLSearchParams({
              month:
                String(month),

              year:
                String(year),
            });


          if (selectedBranch) {

            query.set(
              "branch",
              selectedBranch
            );

          }


          const response =
            await apiFetch(
              `/admin/appointments/statistics/?${query.toString()}`,
              {
                signal:
                  controller.signal,
              }
            );


          const responseData =
            await response.json();


          if (!response.ok) {

            setError(
              responseData.detail ||
              "Unable to load appointment statistics."
            );

            return;

          }


          setData(responseData);

        } catch (fetchError) {

          if (
            fetchError instanceof Error &&
            fetchError.name ===
              "AbortError"
          ) {
            return;
          }


          console.error(
            "Appointment statistics error:",
            fetchError
          );


          setError(
            "Unable to connect to the server."
          );

        } finally {

          if (
            !controller.signal.aborted
          ) {
            setIsLoading(false);
          }

        }

      };


    fetchStatistics();


    return () => {
      controller.abort();
    };

  }, [
    month,
    year,
    selectedBranch,
  ]);


  const summary =
    data?.summary || emptySummary;


  const maximumBranchTotal = Math.max(
    ...(
      data?.branch_chart.map(
        (branch) =>
          branch.total
      ) || [0]
    ),
    1
  );


  const maximumServiceTotal = Math.max(
    ...(
      data?.service_chart.map(
        (service) =>
          service.total
      ) || [0]
    ),
    1
  );


  const maximumDailyTotal = Math.max(
    ...(
      data?.daily_chart.map(
        (day) =>
          day.total
      ) || [0]
    ),
    1
  );


  const getStatusClass = (
    statusName: string
  ) => {

    if (
      statusName === "Completed"
    ) {
      return styles.completedBar;
    }

    if (
      statusName === "Rejected"
    ) {
      return styles.rejectedBar;
    }

    return styles.confirmedBar;

  };


  return (
    <div
      className={
        styles.appointmentPage
      }
    >

      {/* HEADER */}

      <header
        className={
          styles.pageHeader
        }
      >

        <div>

          <h1>
            Appointment Dashboard
          </h1>

          <p>
            Company-wide and branch appointment
            performance.
          </p>

        </div>


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

            <label htmlFor="appointment-branch">
              Branch
            </label>

            <select
              id="appointment-branch"
              value={
                selectedBranch
              }
              onChange={(event) =>
                setSelectedBranch(
                  event.target.value
                )
              }
            >

              <option value="">
                All branches
              </option>

              {data?.branches.map(
                (branch) => (

                  <option
                    key={branch}
                    value={branch}
                  >
                    {branch}
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

            <label htmlFor="appointment-month">
              Month
            </label>

            <select
              id="appointment-month"
              value={month}
              onChange={(event) =>
                setMonth(
                  Number(
                    event.target.value
                  )
                )
              }
            >

              {months.map(
                (
                  monthName,
                  index
                ) => (

                  <option
                    key={monthName}
                    value={index + 1}
                  >
                    {monthName}
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

            <label htmlFor="appointment-year">
              Year
            </label>

            <select
              id="appointment-year"
              value={year}
              onChange={(event) =>
                setYear(
                  Number(
                    event.target.value
                  )
                )
              }
            >

              {years.map(
                (yearOption) => (

                  <option
                    key={yearOption}
                    value={yearOption}
                  >
                    {yearOption}
                  </option>

                )
              )}

            </select>

          </div>

        </div>

      </header>


      {isLoading && (

        <div
          className={
            styles.message
          }
        >
          Loading appointment statistics...
        </div>

      )}


      {error && (

        <div
          className={
            styles.errorMessage
          }
        >
          {error}
        </div>

      )}


      {!isLoading && !error && (

        <>

          {/* SUMMARY CARDS */}

          <section
            className={
              styles.statsGrid
            }
          >

            <article
              className={
                styles.statCard
              }
            >
              <span>Total appointments</span>
              <strong>{summary.total}</strong>
            </article>


            <article
              className={
                styles.statCard
              }
            >
              <span>Confirmed</span>
              <strong>{summary.confirmed}</strong>
            </article>


            <article
              className={
                styles.statCard
              }
            >
              <span>Completed</span>
              <strong>{summary.completed}</strong>
            </article>


            <article
              className={
                styles.statCard
              }
            >
              <span>Rejected</span>
              <strong>{summary.rejected}</strong>
            </article>


            <article
              className={
                styles.statCard
              }
            >
              <span>Paid</span>
              <strong>{summary.paid}</strong>
            </article>


            <article
              className={
                styles.statCard
              }
            >
              <span>Unpaid</span>
              <strong>{summary.unpaid}</strong>
            </article>

          </section>


          <section
            className={
              styles.dashboardGrid
            }
          >

            {/* STATUS CHART */}

            <article
              className={
                styles.chartCard
              }
            >

              <div
                className={
                  styles.cardHeader
                }
              >
                <h2>Appointment status</h2>

                <span>
                  {months[month - 1]} {year}
                </span>
              </div>


              <div
                className={
                  styles.horizontalChart
                }
              >

                {data?.status_chart.map(
                  (item) => {

                    const percentage =
                      summary.total > 0
                        ? (
                            item.value /
                            summary.total
                          ) * 100
                        : 0;

                    return (

                      <div
                        key={item.name}
                        className={
                          styles.barRow
                        }
                      >

                        <div
                          className={
                            styles.barLabel
                          }
                        >
                          <span>{item.name}</span>
                          <strong>{item.value}</strong>
                        </div>

                        <div
                          className={
                            styles.barTrack
                          }
                        >
                          <div
                            className={`${styles.barFill} ${getStatusClass(item.name)}`}
                            style={{
                              width:
                                `${percentage}%`,
                            }}
                          />
                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            </article>


            {/* SERVICES CHART */}

            <article
              className={
                styles.chartCard
              }
            >

              <div
                className={
                  styles.cardHeader
                }
              >
                <h2>Appointments by service</h2>
              </div>


              <div
                className={
                  styles.horizontalChart
                }
              >

                {data?.service_chart.length ? (

                  data.service_chart.map(
                    (item) => (

                      <div
                        key={item.service}
                        className={
                          styles.barRow
                        }
                      >

                        <div
                          className={
                            styles.barLabel
                          }
                        >
                          <span>{item.service}</span>
                          <strong>{item.total}</strong>
                        </div>

                        <div
                          className={
                            styles.barTrack
                          }
                        >
                          <div
                            className={`${styles.barFill} ${styles.serviceBar}`}
                            style={{
                              width:
                                `${
                                  (
                                    item.total /
                                    maximumServiceTotal
                                  ) * 100
                                }%`,
                            }}
                          />
                        </div>

                      </div>

                    )
                  )

                ) : (

                  <p
                    className={
                      styles.noData
                    }
                  >
                    No service data available.
                  </p>

                )}

              </div>

            </article>

          </section>


          {/* BRANCH CHART */}

          <section
            className={
              styles.chartCard
            }
          >

            <div
              className={
                styles.cardHeader
              }
            >
              <h2>Appointments by branch</h2>

              <span>
                {
                  selectedBranch ||
                  "All branches"
                }
              </span>
            </div>


            {data?.branch_chart.length ? (

              <div
                className={
                  styles.branchChart
                }
              >

                {data.branch_chart.map(
                  (item) => (

                    <div
                      key={item.branch}
                      className={
                        styles.branchRow
                      }
                    >

                      <div
                        className={
                          styles.branchName
                        }
                      >
                        {item.branch}
                      </div>


                      <div
                        className={
                          styles.branchBarArea
                        }
                      >

                        <div
                          className={
                            styles.barTrack
                          }
                        >
                          <div
                            className={`${styles.barFill} ${styles.branchBar}`}
                            style={{
                              width:
                                `${
                                  (
                                    item.total /
                                    maximumBranchTotal
                                  ) * 100
                                }%`,
                            }}
                          />
                        </div>


                        <div
                          className={
                            styles.branchValues
                          }
                        >
                          <strong>
                            {item.total} total
                          </strong>

                          <span>
                            {item.completed} completed
                          </span>

                          <span>
                            {item.confirmed} confirmed
                          </span>

                          <span>
                            {item.rejected} rejected
                          </span>
                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <p
                className={
                  styles.noData
                }
              >
                No branch appointment data available.
              </p>

            )}

          </section>


          {/* DAILY CHART */}

          <section
            className={
              styles.chartCard
            }
          >

            <div
              className={
                styles.cardHeader
              }
            >
              <h2>Daily appointments</h2>

              <span>
                {months[month - 1]} {year}
              </span>
            </div>


            <div
              className={
                styles.dailyChartScroll
              }
            >

              <div
                className={
                  styles.dailyChart
                }
              >

                {data?.daily_chart.map(
                  (item) => (

                    <div
                      key={item.date}
                      className={
                        styles.dailyColumn
                      }
                      title={
                        `${item.day_name} ${item.date}: ${item.total} appointments`
                      }
                    >

                      <span
                        className={
                          styles.dailyValue
                        }
                      >
                        {
                          item.total > 0
                            ? item.total
                            : ""
                        }
                      </span>


                      <div
                        className={
                          styles.dailyBarSpace
                        }
                      >
                        <div
                          className={
                            styles.dailyBar
                          }
                          style={{
                            height:
                              `${
                                (
                                  item.total /
                                  maximumDailyTotal
                                ) * 100
                              }%`,
                          }}
                        />
                      </div>


                      <span
                        className={
                          styles.dailyDay
                        }
                      >
                        {item.day}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          </section>

        </>

      )}

    </div>
  );

};


export default AdminAppointment;