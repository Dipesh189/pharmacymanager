import {
  useEffect,
  useState,
} from "react";

import { apiFetch } from "../../../services/stafftimesheet";

import styles from "./AminDashboard.module.css";

const currentDate = new Date();
const currentMonth =
  currentDate.getMonth() + 1;
const currentYear =
  currentDate.getFullYear();

// type StatCardProps = {
//   title: string;
//   value: string;
//   change: string;
//   positive?: boolean;
// };

// const StatCard = ({
//   title,
//   value,
//   change,
//   positive = true,
// }: StatCardProps) => {
//   return (
//     <div className={styles.statCard}>
//       <p className={styles.statLabel}>
//         {title}
//       </p>

//       <h2 className={styles.statValue}>
//         {value}
//       </h2>

//       <p
//         className={`${styles.statChange} ${
//           positive
//             ? styles.positive
//             : styles.negative
//         }`}
//       >
//         {change}
//       </p>
//     </div>
//   );
// };

type Branch = {
  branch_name: string;
};

type MonthData = {
  value: number;
  name: string;
};

const months: MonthData[] = [
  { value: 1, name: "January" },
  { value: 2, name: "February" },
  { value: 3, name: "March" },
  { value: 4, name: "April" },
  { value: 5, name: "May" },
  { value: 6, name: "June" },
  { value: 7, name: "July" },
  { value: 8, name: "August" },
  { value: 9, name: "September" },
  { value: 10, name: "October" },
  { value: 11, name: "November" },
  { value: 12, name: "December" },
];

const years: number[] = Array.from(
  { length: 5 },
  (_, index) =>
    currentYear - 2 + index
);

const AdminDashboard = () => {
  const [branchList, setBranchList] =
    useState<Branch[]>([]);

  const [
    selectedBranch,
    setSelectedBranch,
  ] = useState<string | null>(null);

  const [
    selectedMonth,
    setSelectedMonth,
  ] = useState<number>(currentMonth);

  const [
    selectedYear,
    setSelectedYear,
  ] = useState<number>(currentYear);

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiFetch(
          "/get-single-data/branch/"
        );

        if (!response.ok) {
          throw new Error(
            `Unable to fetch branches: ${response.status}`
          );
        }

        const data: Branch[] =
          await response.json();

        setBranchList(data);
      } catch (error) {
        console.error(
          "Error fetching branches:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to fetch branches"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, [selectedBranch,selectedMonth,selectedYear]);

  return (
    <div className={styles.dashboard}>
      <section
        className={styles.filterCard}
      >
        <div
          className={styles.filterHeader}
        >
          <div>
            <h1
              className={styles.filterTitle}
            >
              Branch Dashboard
            </h1>

            <p
              className={
                styles.filterDescription
              }
            >
              Select a branch, month and year
              to view its information.
            </p>
          </div>

          {selectedBranch && (
            <div
              className={
                styles.selectedSummary
              }
            >
              {selectedBranch} ·{" "}
              {
                months.find(
                  (month) =>
                    month.value ===
                    selectedMonth
                )?.name
              }{" "}
              {selectedYear}
            </div>
          )}
        </div>

        <div
          className={styles.filterContent}
        >
          <div
            className={
              styles.branchFilterGroup
            }
          >
            <p
              className={
                styles.filterGroupLabel
              }
            >
              Select Branch
            </p>

            {isLoading && (
              <p className={styles.message}>
                Loading branches...
              </p>
            )}

            {error && (
              <p
                className={`${styles.message} ${styles.errorMessage}`}
              >
                {error}
              </p>
            )}

            {!isLoading &&
              !error &&
              branchList.length === 0 && (
                <p
                  className={styles.message}
                >
                  No branches found.
                </p>
              )}

            {!isLoading &&
              !error &&
              branchList.length > 0 && (
                <div
                  className={
                    styles.branchesList
                  }
                >
                  {branchList.map(
                    (branch) => (
                      <button
                        key={
                          branch.branch_name
                        }
                        type="button"
                        className={`${
                          styles.branchItem
                        } ${
                          selectedBranch ===
                          branch.branch_name
                            ? styles.active
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedBranch(
                            branch.branch_name
                          )
                        }
                      >
                        {branch.branch_name}
                      </button>
                    )
                  )}
                </div>
              )}
          </div>

          <div
            className={styles.dateFilters}
          >
            <div
              className={styles.selectGroup}
            >
              <label
                htmlFor="dashboard-month"
                className={
                  styles.selectLabel
                }
              >
                Month
              </label>

              <select
                id="dashboard-month"
                className={
                  styles.selectInput
                }
                value={selectedMonth}
                onChange={(event) =>
                  setSelectedMonth(
                    Number(
                      event.target.value
                    )
                  )
                }
              >
                {months.map((month) => (
                  <option
                    key={month.value}
                    value={month.value}
                  >
                    {month.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={styles.selectGroup}
            >
              <label
                htmlFor="dashboard-year"
                className={
                  styles.selectLabel
                }
              >
                Year
              </label>

              <select
                id="dashboard-year"
                className={
                  styles.selectInput
                }
                value={selectedYear}
                onChange={(event) =>
                  setSelectedYear(
                    Number(
                      event.target.value
                    )
                  )
                }
              >
                {years.map((year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className=""></section>
    </div>
  );
};

export default AdminDashboard;