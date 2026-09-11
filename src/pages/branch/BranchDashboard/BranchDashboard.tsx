import {
  useCallback,
  useMemo,
  useState,
} from "react";

import Calendar from "../../../components/Calendar/Calendar";
import NavbarStaffButton from "../../../components/NavbarStaffButton/NavbarStaffButton";

/*
 * Change this path only if api.tsx is
 * stored somewhere else.
 */


import style from "./BranchDashboard.module.css";
import { apiFetch } from "../../../services/stafftimesheet";

type BranchDashboardProps = {
  onLogout: () => void;
};



type ScheduleChild = {
  shift_start_time: string;
  shift_end_time: string;
  staff_full_name: string;
  position: string | null;
};

type DailySchedule = {
  Date: string;
  childrens: ScheduleChild[];
};

type ScheduleApiResponse = {
  data?: unknown;
  schedule?: unknown;
  schedules?: unknown;
  monthly_schedules?: unknown;
};

const isDailyScheduleArray = (
  value: unknown
): value is DailySchedule[] => {
  return Array.isArray(value);
};

const getSchedulesFromResponse = (
  responseData: unknown
): DailySchedule[] => {
  if (isDailyScheduleArray(responseData)) {
    return responseData;
  }

  if (
    !responseData ||
    typeof responseData !== "object"
  ) {
    return [];
  }

  const responseObject =
    responseData as ScheduleApiResponse;

  const possibleSchedules = [
    responseObject.data,
    responseObject.schedule,
    responseObject.schedules,
    responseObject.monthly_schedules,
  ];

  for (const schedules of possibleSchedules) {
    if (isDailyScheduleArray(schedules)) {
      return schedules;
    }
  }

  return [];
};

const getDateKey = (
  date: Date
): string => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatTime = (
  time: string
): string => {
  return time.slice(0, 5);
};

const BranchDashboard = ({
  onLogout,
}: BranchDashboardProps) => {
  const [selectedDate, setSelectedDate] =
    useState<Date | null>(
      new Date()
    );

  const [
    monthlySchedules,
    setMonthlySchedules,
  ] = useState<DailySchedule[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Runs when Calendar opens or when
   * previous/next month is pressed.
   */
  const getMonthSchedule =
    useCallback(
      async (
        month: number,
        year: number
      ) => {
        setIsLoading(true);
        setError(null);

        try {
          const response =
            await apiFetch(
              `/branch/month-schedule/?month=${month}&year=${year}`,
              {
                method: "GET",
              }
            );

          if (!response.ok) {
            throw new Error(
              `Unable to load schedule. Status: ${response.status}`
            );
          }

          const contentType =
            response.headers.get(
              "content-type"
            );

          if (
            !contentType?.includes(
              "application/json"
            )
          ) {
            const responseText =
              await response.text();

            console.error(
              "Expected JSON but received:",
              responseText
            );

            throw new Error(
              "The schedule API did not return JSON."
            );
          }

          const responseData: unknown =
            await response.json();

          console.log(
            "Month schedule response:",
            responseData
          );

          const schedules =
            getSchedulesFromResponse(
              responseData
            );

          setMonthlySchedules(schedules);
        } catch (error) {
          console.error(
            "Schedule request failed:",
            error
          );

          setMonthlySchedules([]);

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load branch schedule."
          );
        } finally {
          setIsLoading(false);
        }
      },
      []
    );

  /*
   * Find the grouped schedule that matches
   * the selected calendar date.
   */
  const selectedDaySchedules =
    useMemo<ScheduleChild[]>(
      () => {
        if (
          !selectedDate ||
          !Array.isArray(
            monthlySchedules
          )
        ) {
          return [];
        }

        const selectedDateKey =
          getDateKey(selectedDate);

        const selectedDay =
          monthlySchedules.find(
            (schedule) =>
              schedule.Date?.slice(
                0,
                10
              ) === selectedDateKey
          );

        return Array.isArray(
          selectedDay?.childrens
        )
          ? selectedDay.childrens
          : [];
      },
      [
        selectedDate,
        monthlySchedules,
      ]
    );

  const pharmacists =
    useMemo(() => {
      return selectedDaySchedules.filter(
        (schedule) =>
          schedule.position
            ?.toLowerCase()
            .includes("pharmacist")
      );
    }, [selectedDaySchedules]);

  const staffMembers =
    useMemo(() => {
      return selectedDaySchedules.filter(
        (schedule) =>
          !schedule.position
            ?.toLowerCase()
            .includes("pharmacist")
      );
    }, [selectedDaySchedules]);

  return (
    <>
      <div
        className={
          style.branchDashboardMainContainer
        }
      >
        <Calendar
          monthRange={1}
          selectedDate={
            selectedDate
          }
          onDateSelect={
            setSelectedDate
          }
          onMonthChange={
            getMonthSchedule
          }
        />

        <div
          className={
            style.workingBranchContainer
          }
        >
          <div
            className={
              style.headingBranchContainer
            }
          >
            {selectedDate
              ? selectedDate.toLocaleDateString(
                  "en-GB",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )
              : "Select a date"}
          </div>

          {isLoading && (
            <p>
              Loading schedule...
            </p>
          )}

          {error && (
            <p
              className={style.error}
            >
              {error}
            </p>
          )}

          {!isLoading &&
            !error && (
              <>
                <div
                  className={
                    style.workingPharmacist
                  }
                >
                  <div
                    className={
                      style.headingBranchContainer
                    }
                  >
                    Pharmacist
                  </div>

                  {pharmacists.length >
                  0 ? (
                    <ul>
                      {pharmacists.map(
                        (
                          schedule,
                          index
                        ) => (
                          <li
                            key={`${schedule.staff_full_name}-${schedule.shift_start_time}-${index}`}
                          >
                            <span>
                              {
                                schedule.staff_full_name
                              }
                            </span>
                            <span> </span>

                            <span>
                              {formatTime(
                                schedule.shift_start_time
                              )}
                              {" - "}
                              {formatTime(
                                schedule.shift_end_time
                              )}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>
                      No pharmacist
                      scheduled.
                    </p>
                  )}
                </div>

                <div
                  className={
                    style.workingBranchMember
                  }
                >
                  <div
                    className={
                      style.headingBranchContainer
                    }
                  >
                    Staff
                  </div>

                  {staffMembers.length >
                  0 ? (
                    <ul>
                      {staffMembers.map(
                        (
                          schedule,
                          index
                        ) => (
                          <li
                            key={`${schedule.staff_full_name}-${schedule.shift_start_time}-${index}`}
                          >
                            <span>
                              {
                                schedule.staff_full_name
                              }

                              {schedule.position
                                ? ` (${schedule.position})`
                                : ""}
                            </span>

                            <span>
                              {formatTime(
                                schedule.shift_start_time
                              )}
                              {" - "}
                              {formatTime(
                                schedule.shift_end_time
                              )}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>
                      No staff
                      scheduled.
                    </p>
                  )}
                </div>

                <div
                  className={
                    style.holidaySatffMember
                  }
                >
                  <div
                    className={
                      style.headingBranchContainer
                    }
                  >
                    On Holiday
                  </div>

                  <p>
                    No holiday
                    information.
                  </p>
                </div>

                <div
                  className={
                    style.sickBranchMember
                  }
                >
                  <div
                    className={
                      style.headingBranchContainer
                    }
                  >
                    On Sick Leave
                  </div>

                  <p>
                    No sickness
                    information.
                  </p>
                </div>
              </>
            )}
        </div>
      </div>

      <NavbarStaffButton
        onLogout={onLogout}
      />
    </>
  );
};

export default BranchDashboard;
