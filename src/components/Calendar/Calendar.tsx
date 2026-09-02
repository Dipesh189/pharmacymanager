import {
  useEffect,
  useMemo,
  useState,
} from "react";

import style from "./Calendar.module.css";

type CalendarProps = {
  // Single-date selection
  selectedDate?: Date | null;

  onDateSelect?: (
    date: Date
  ) => void;

  // Multiple-date selection
  multipleSelect?: boolean;

  selectedDates?: Date[];

  onDatesSelect?: (
    dates: Date[]
  ) => void;

  // Called when displayed month changes
  onMonthChange?: (
    month: number,
    year: number
  ) => void;

  // Number of months before/after current month
  monthRange?: number | "all";

  // Prevent viewing months before current month
  disablePreviousMonths?: boolean;

  /*
   * Number of complete days required
   * before a date can be selected.
   *
   * Example:
   * Today: 02/09/2026
   * days={2}
   *
   * 03/09 and 04/09 are complete waiting days.
   * 05/09/2026 onward will be enabled.
   */
  days?: number;

  // Specific dates that cannot be selected
  blockedDates?: Array<
    Date | string
  >;
};

const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

// =========================
// DATE HELPERS
// =========================

const getStartOfDay = (
  date: Date
): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};

const getStartOfMonth = (
  date: Date
): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );
};

const addDays = (
  date: Date,
  numberOfDays: number
): Date => {
  const newDate =
    getStartOfDay(date);

  newDate.setDate(
    newDate.getDate() +
      numberOfDays
  );

  return newDate;
};

const getDateKey = (
  date: Date
): string => {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getBlockedDateKey = (
  blockedDate: Date | string
): string => {
  if (
    blockedDate instanceof Date
  ) {
    return getDateKey(
      blockedDate
    );
  }

  return blockedDate.slice(
    0,
    10
  );
};

// =========================
// CALENDAR
// =========================

const Calendar = ({
  selectedDate = null,
  onDateSelect,

  multipleSelect = false,
  selectedDates = [],
  onDatesSelect,

  onMonthChange,

  monthRange = "all",

  disablePreviousMonths = false,

  days,

  blockedDates = [],
}: CalendarProps) => {
  const today =
    getStartOfDay(new Date());

  const currentMonth =
    getStartOfMonth(today);

  /*
   * Earliest selectable date.
   *
   * Today: 02/09/2026
   * days={2}
   *
   * Result: 05/09/2026
   */
  const minimumSelectableDate =
    days !== undefined
      ? addDays(
          today,
          Math.max(0, days) + 1
        )
      : null;

  // =========================
  // DISPLAYED MONTH
  // =========================

  const [
    displayedMonth,
    setDisplayedMonth,
  ] = useState<Date>(
    getStartOfMonth(
      selectedDate ??
        selectedDates[0] ??
        today
    )
  );

  const year =
    displayedMonth.getFullYear();

  const month =
    displayedMonth.getMonth();

  // =========================
  // MONTH CHANGE CALLBACK
  // =========================

  useEffect(() => {
    onMonthChange?.(
      month + 1,
      year
    );
  }, [
    month,
    year,
    onMonthChange,
  ]);

  // =========================
  // MONTH NAVIGATION RANGE
  // =========================

  const rangeMinimumMonth =
    monthRange === "all"
      ? null
      : new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() -
            monthRange,
          1
        );

  /*
   * When disablePreviousMonths is true,
   * current month is the earliest visible
   * month.
   */
  const minimumMonth =
    disablePreviousMonths
      ? currentMonth
      : rangeMinimumMonth;

  const maximumMonth =
    monthRange === "all"
      ? null
      : new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() +
            monthRange,
          1
        );

  const previousMonth =
    new Date(
      year,
      month - 1,
      1
    );

  const nextMonth =
    new Date(
      year,
      month + 1,
      1
    );

  const previousDisabled =
    minimumMonth !== null &&
    previousMonth <
      minimumMonth;

  const nextDisabled =
    maximumMonth !== null &&
    nextMonth >
      maximumMonth;

  const showPreviousMonth =
    () => {
      if (previousDisabled) {
        return;
      }

      setDisplayedMonth(
        previousMonth
      );
    };

  const showNextMonth =
    () => {
      if (nextDisabled) {
        return;
      }

      setDisplayedMonth(
        nextMonth
      );
    };

  // =========================
  // MONTH INFORMATION
  // =========================

  const monthName =
    displayedMonth.toLocaleDateString(
      "en-GB",
      {
        month: "long",
        year: "numeric",
      }
    );

  const firstWeekday =
    new Date(
      year,
      month,
      1
    ).getDay();

  const totalDays =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const calendarDays:
    Array<number | null> = [
    ...Array(
      firstWeekday
    ).fill(null),

    ...Array.from(
      {
        length: totalDays,
      },
      (_, index) =>
        index + 1
    ),
  ];

  while (
    calendarDays.length % 7 !==
    0
  ) {
    calendarDays.push(null);
  }

  // =========================
  // BLOCKED DATE KEYS
  // =========================

  const blockedDateKeys =
    useMemo(() => {
      return new Set(
        blockedDates.map(
          getBlockedDateKey
        )
      );
    }, [blockedDates]);

  // =========================
  // DATE HELPERS
  // =========================

  const createDate = (
    day: number
  ): Date => {
    return new Date(
      year,
      month,
      day
    );
  };

  const isToday = (
    day: number
  ): boolean => {
    return (
      today.getFullYear() ===
        year &&
      today.getMonth() ===
        month &&
      today.getDate() === day
    );
  };

  // =========================
  // SELECTED DATE CHECK
  // =========================

  const isSingleSelected = (
    day: number
  ): boolean => {
    if (
      !selectedDate ||
      multipleSelect
    ) {
      return false;
    }

    return (
      selectedDate.getFullYear() ===
        year &&
      selectedDate.getMonth() ===
        month &&
      selectedDate.getDate() ===
        day
    );
  };

  const isMultipleSelected = (
    day: number
  ): boolean => {
    if (!multipleSelect) {
      return false;
    }

    const dateKey =
      getDateKey(
        createDate(day)
      );

    return selectedDates.some(
      (date) =>
        getDateKey(date) ===
        dateKey
    );
  };

  const isSelected = (
    day: number
  ): boolean => {
    return (
      isSingleSelected(day) ||
      isMultipleSelected(day)
    );
  };

  // =========================
  // BLOCKED DATE CHECK
  // =========================

  const isManuallyBlocked = (
    day: number
  ): boolean => {
    const date =
      createDate(day);

    return blockedDateKeys.has(
      getDateKey(date)
    );
  };

  /*
   * Disable dates before the minimum
   * selectable date.
   *
   * If today is 02/09/2026 and days={2}:
   *
   * 01/09 disabled
   * 02/09 disabled
   * 03/09 disabled
   * 04/09 disabled
   * 05/09 enabled
   * 06/09 enabled
   * All later dates enabled
   */
  const isBeforeMinimumDate = (
    day: number
  ): boolean => {
    if (
      !minimumSelectableDate
    ) {
      return false;
    }

    const date =
      createDate(day);

    return (
      date <
      minimumSelectableDate
    );
  };

  const isBlocked = (
    day: number
  ): boolean => {
    return (
      isManuallyBlocked(day) ||
      isBeforeMinimumDate(day)
    );
  };

  // =========================
  // DATE SELECTION
  // =========================

  const handleDateSelect = (
    day: number
  ) => {
    if (isBlocked(day)) {
      return;
    }

    const selected =
      createDate(day);

    // Single selection
    if (!multipleSelect) {
      onDateSelect?.(
        selected
      );

      return;
    }

    // Multiple selection
    const selectedKey =
      getDateKey(selected);

    const alreadySelected =
      selectedDates.some(
        (date) =>
          getDateKey(date) ===
          selectedKey
      );

    /*
     * Clicking an already-selected date
     * removes it.
     */
    if (alreadySelected) {
      const updatedDates =
        selectedDates.filter(
          (date) =>
            getDateKey(date) !==
            selectedKey
        );

      onDatesSelect?.(
        updatedDates
      );

      return;
    }

    /*
     * Add the selected date and sort
     * all selected dates chronologically.
     */
    const updatedDates = [
      ...selectedDates,
      selected,
    ].sort(
      (
        firstDate,
        secondDate
      ) =>
        firstDate.getTime() -
        secondDate.getTime()
    );

    onDatesSelect?.(
      updatedDates
    );
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div
      className={
        style.calendar
      }
    >
      <div
        className={
          style.calendarHeader
        }
      >
        <button
          type="button"
          className={
            style.calendarIconPre
          }
          onClick={
            showPreviousMonth
          }
          disabled={
            previousDisabled
          }
          aria-label="Previous month"
        >
          ‹
        </button>

        <div>
          {monthName}
        </div>

        <button
          type="button"
          className={
            style.calendarIconNext
          }
          onClick={
            showNextMonth
          }
          disabled={
            nextDisabled
          }
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div
        className={
          style.calendarBody
        }
      >
        <div
          className={
            style.calendarWeekdays
          }
        >
          {weekDays.map(
            (weekDay) => (
              <div
                key={weekDay}
              >
                {weekDay}
              </div>
            )
          )}
        </div>

        <div
          className={
            style.calendarDays
          }
        >
          {calendarDays.map(
            (day, index) => {
              if (
                day === null
              ) {
                return (
                  <div
                    key={`empty-${index}`}
                    className={
                      style.calendarEmptyDay
                    }
                  />
                );
              }

              const blocked =
                isBlocked(day);

              const selected =
                isSelected(day);

              const classNames = [
                style.calendarDay,

                isToday(day) &&
                !blocked
                  ? style.today
                  : "",

                selected &&
                !blocked
                  ? style.selectedDay
                  : "",

                blocked
                  ? style.blockedDay
                  : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={`${year}-${month}-${day}`}
                  type="button"
                  className={
                    classNames
                  }
                  disabled={
                    blocked
                  }
                  onClick={() =>
                    handleDateSelect(
                      day
                    )
                  }
                  aria-pressed={
                    selected
                  }
                  aria-label={
                    blocked
                      ? `${day} ${monthName} unavailable`
                      : `Select ${day} ${monthName}`
                  }
                >
                  {day}
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;