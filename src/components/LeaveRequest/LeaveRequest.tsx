import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  ChangeEventHandler,
  ComponentProps,
} from "react";

import Calendar from "../Calendar/Calendar";

import {
  apiFetch,
} from "../../services/stafftimesheet";

import styles from "./LeaveRequest.module.css";

type SavedUser = {
  first_name?: string;
  last_name?: string;
  position?: string;
  branch_name?: string;
};
let position = "";
const savedUser =
    localStorage.getItem("user");

if (savedUser) {

    try {

      const user: SavedUser =
        JSON.parse(
          savedUser
        );

        position =
        user.position ?? "";}catch (error) {

      console.error(
        "Unable to read user:",
        error
      );

    }}


type LeaveType =
  | "holiday"
  | "sick"
  | "emergency";


type LeaveRequestProps = {
  type: LeaveType;
  title: string;
};


type LeaveFormData = {
  startTime: string;
  endTime: string;
  reason: string;
};


type LeaveRequestPayload = {
  dates: string[];
  start_time: string;
  end_time: string;
  reason: string;
  type: LeaveType;
};


type CreatedLeaveRequest = {
  holiday_id: number;
  date: string;
  start_time: string;
  end_time: string;
  reason: string | null;
  status: string;
  holiday_status: string | null;
  is_off_sick: boolean;
  is_emergency: boolean;
  is_unpaid: boolean;
  branch_name: string | null;
};


type LeaveRequestResponse = {
  success: boolean;
  message?: string;

  error?:
    | string
    | string[]
    | Record<string, string[]>;

  created_count?: number;
  leave_requests?: CreatedLeaveRequest[];
};


type UnavailableDate = {
  date: string;
  branch_staff_off: number;
  company_staff_off: number;
  reason: string;
};


type AvailabilityResponse = {
  success: boolean;
  year?: number;
  month?: number;
  branch?: string;
  branch_staff_limit?: number;
  company_staff_limit?: number;
  unavailable_dates?: UnavailableDate[];
  blocked_dates?: string[];
  error?: string;
};


type FormSubmitHandler =
  NonNullable<
    ComponentProps<"form">["onSubmit"]
  >;


const LeaveRequest = ({
  type,
  title,
}: LeaveRequestProps) => {

  // =========================
  // SELECTED DATES
  // =========================

  const [
    selectedDates,
    setSelectedDates,
  ] = useState<Date[]>([]);


  // =========================
  // BLOCKED DATES
  // =========================

  const [
    blockedDates,
    setBlockedDates,
  ] = useState<string[]>([]);

  const [
    unavailableDates,
    setUnavailableDates,
  ] = useState<UnavailableDate[]>([]);

  const [
    isLoadingDates,
    setIsLoadingDates,
  ] = useState(false);

  const [
    availabilityError,
    setAvailabilityError,
  ] = useState("");


  // Store the currently displayed month
  const today = new Date();

  const displayedMonthRef = useRef({
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });


  // Prevent an older request from replacing
  // the result of a newer request.
  const availabilityRequestId =
    useRef(0);


  // =========================
  // FORM DATA
  // =========================

  const [
    formData,
    setFormData,
  ] = useState<LeaveFormData>({
    startTime: "",
    endTime: "",
    reason: "",
  });


  // =========================
  // SUBMISSION STATE
  // =========================

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  // =========================
  // REASON REQUIRED
  // =========================

  const reasonRequired =
    type === "sick" ||
    type === "emergency";


  // =========================
  // FORMAT DATE FOR API
  // =========================

  const formatDateForApi = (
    selectedDate: Date
  ): string => {

    const year =
      selectedDate.getFullYear();

    const month = String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      selectedDate.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  // =========================
  // FORMAT DATE FOR DISPLAY
  // =========================

  const formatDateForDisplay = (
    dateValue: string
  ): string => {

    const [
      year,
      month,
      day,
    ] = dateValue.split("-");

    if (
      !year ||
      !month ||
      !day
    ) {
      return dateValue;
    }

    return `${day}/${month}/${year}`;
  };


  // =========================
  // FORMAT API ERROR
  // =========================

  const formatApiError = (
    error:
      | string
      | string[]
      | Record<string, string[]>
      | undefined
  ): string => {

    if (!error) {
      return (
        "Unable to submit the leave request."
      );
    }

    if (typeof error === "string") {
      return error;
    }

    if (Array.isArray(error)) {
      return error.join(" ");
    }

    return Object.values(error)
      .flat()
      .join(" ");
  };


  // =========================
  // FETCH BLOCKED DATES
  // =========================

  const fetchUnavailableDates =
    useCallback(
      async (
        month: number,
        year: number,
      ) => {

        displayedMonthRef.current = {
          month,
          year,
        };


        // Sick and emergency leave do not use
        // holiday availability limits.
        if (type !== "holiday") {
          setBlockedDates([]);
          setUnavailableDates([]);
          setAvailabilityError("");
          setIsLoadingDates(false);

          return;
        }


        const currentRequestId =
          ++availabilityRequestId.current;

        try {
          setIsLoadingDates(true);
          setAvailabilityError("");

          const response = await apiFetch(
            (
              "/staff/leave/" +
              "unavailable-dates/" +
              `?year=${year}` +
              `&month=${month}`
            ),
            {
              method: "GET",
            }
          );

          const result:
            AvailabilityResponse =
            await response.json();


          // Ignore an older response if the user
          // has already changed month again.
          if (
            currentRequestId !==
            availabilityRequestId.current
          ) {
            return;
          }


          if (!response.ok) {
            throw new Error(
              result.error ||
              "Unable to load unavailable dates."
            );
          }


          setBlockedDates(
            result.blocked_dates || []
          );

          setUnavailableDates(
            result.unavailable_dates || []
          );


          // Remove selected dates that have
          // become unavailable.
          const blockedDateSet = new Set(
            result.blocked_dates || []
          );

          setSelectedDates(
            (previousDates) =>
              previousDates.filter(
                (selectedDate) =>
                  !blockedDateSet.has(
                    formatDateForApi(
                      selectedDate
                    )
                  )
              )
          );

        } catch (error) {

          if (
            currentRequestId !==
            availabilityRequestId.current
          ) {
            return;
          }

          const message =
            error instanceof Error
              ? error.message
              : (
                  "Unable to load " +
                  "unavailable dates."
                );

          setAvailabilityError(
            message
          );

          setBlockedDates([]);
          setUnavailableDates([]);

        } finally {

          if (
            currentRequestId ===
            availabilityRequestId.current
          ) {
            setIsLoadingDates(false);
          }

        }

      },
      [type]
    );


  // =========================
  // MONTH CHANGE
  // =========================

  const handleMonthChange =
    useCallback(
      (
        month: number,
        year: number,
      ) => {

        void fetchUnavailableDates(
          month,
          year,
        );

      },
      [fetchUnavailableDates]
    );


  // =========================
  // RESET WHEN TYPE CHANGES
  // =========================

  useEffect(() => {

    setSelectedDates([]);

    setFormData({
      startTime: "",
      endTime: "",
      reason: "",
    });

    setSuccessMessage("");
    setErrorMessage("");
    setAvailabilityError("");

    if (type !== "holiday") {
      setBlockedDates([]);
      setUnavailableDates([]);
    }

  }, [type]);


  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange:
    ChangeEventHandler<
      HTMLInputElement |
      HTMLTextAreaElement
    > = (event) => {

      const {
        name,
        value,
      } = event.currentTarget;

      setFormData(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };


  // =========================
  // HANDLE SUBMIT
  // =========================

  const handleSubmit:
    FormSubmitHandler =
    async (event) => {

      event.preventDefault();

      setSuccessMessage("");
      setErrorMessage("");


      if (
        selectedDates.length === 0
      ) {
        const message =
          "Please select at least one date.";

        setErrorMessage(message);
        alert(message);

        return;
      }


      if (
        !formData.startTime ||
        !formData.endTime
      ) {
        const message =
          "Please enter the start and end times.";

        setErrorMessage(message);
        alert(message);

        return;
      }


      if (
        formData.endTime <=
        formData.startTime
      ) {
        const message =
          "End time must be later than start time.";

        setErrorMessage(message);
        alert(message);

        return;
      }


      if (
        reasonRequired &&
        !formData.reason.trim()
      ) {
        const message =
          "Please enter a reason.";

        setErrorMessage(message);
        alert(message);

        return;
      }


      const submittedData:
        LeaveRequestPayload = {

          dates: selectedDates
            .map(formatDateForApi)
            .sort(),

          start_time:
            formData.startTime,

          end_time:
            formData.endTime,

          reason:
            formData.reason.trim(),

          type,
        };


      try {
        setIsSubmitting(true);

        const response = await apiFetch(
          "/staff/leave/create/",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              submittedData
            ),
          }
        );


        const result:
          LeaveRequestResponse =
          await response.json();


        if (!response.ok) {
          throw new Error(
            formatApiError(
              result.error
            )
          );
        }


        const leaveRequests =
          result.leave_requests || [];


        const requestDetails =
          leaveRequests
            .map((leaveRequest) => {

              const displayDate =
                formatDateForDisplay(
                  leaveRequest.date
                );

              return (
                `${displayDate} - ` +
                `${leaveRequest.status}`
              );

            })
            .join("\n");


        const confirmationMessage =
          requestDetails
            ? (
                "Your leave request has " +
                "been submitted.\n\n" +
                requestDetails
              )
            : (
                result.message ||
                "Your leave request has " +
                "been submitted successfully."
              );


        alert(
          confirmationMessage
        );


        setSuccessMessage(
          result.message ||
          "Your leave request has been " +
          "submitted successfully."
        );


        setSelectedDates([]);

        setFormData({
          startTime: "",
          endTime: "",
          reason: "",
        });


        // Reload availability because this
        // submission may block a date.
        if (type === "holiday") {

          const {
            month,
            year,
          } = displayedMonthRef.current;

          await fetchUnavailableDates(
            month,
            year,
          );

        }

      } catch (error) {

        const message =
          error instanceof Error
            ? error.message
            : (
                "Unable to submit the " +
                "leave request."
              );

        setErrorMessage(message);
        alert(message);

      } finally {

        setIsSubmitting(false);

      }

    };


  return (

    <div
      className={
        styles.leaveContainer
      }
    >

      <h1>
        {title}
      </h1>


      {
        successMessage && (

          <div
            className={
              styles.successMessage
            }
            role="status"
          >
            {successMessage}
          </div>

        )
      }


      {
        errorMessage && (

          <div
            className={
              styles.errorMessage
            }
            role="alert"
          >
            {errorMessage}
          </div>

        )
      }


      {
        type === "holiday" &&
        isLoadingDates && (

          <p>
            Checking holiday availability...
          </p>

        )
      }


      {
        type === "holiday" &&
        availabilityError && (

          <div
            className={
              styles.errorMessage
            }
            role="alert"
          >
            {availabilityError}
          </div>

        )
      }


      {
        type === "holiday" &&
        unavailableDates.length > 0 && (

          <p>
            Dates shown in red are unavailable
            because the branch or company
            holiday limit has been reached.
          </p>

        )
      }


      <Calendar
        multipleSelect

        selectedDates={
          selectedDates
        }

        onDatesSelect={
          setSelectedDates
        }

        onMonthChange={
          handleMonthChange
        }

        blockedDates={
          type === "holiday"&&
          position!=="Pharmacist"
            ? blockedDates
            : []
        }

        {...(
          type === "holiday"&&
          position!=="Pharmacist"
            ? { days: 30 }
            : {}
        )}

        disablePreviousMonths={
          type === "holiday"
        }
      />


      <form
        className={
          styles.leaveForm
        }

        onSubmit={
          handleSubmit
        }
      >

        <div
          className={
            styles.dateInputs
          }
        >

          <div
            className={
              styles.timeInput
            }
          >

            <label
              htmlFor={
                `${type}-startTime`
              }
            >
              Start Time
            </label>

            <input
              type="time"

              name="startTime"

              id={
                `${type}-startTime`
              }

              value={
                formData.startTime
              }

              onChange={
                handleChange
              }

              required

              disabled={
                isSubmitting
              }
            />

          </div>


          <div
            className={
              styles.timeInput
            }
          >

            <label
              htmlFor={
                `${type}-endTime`
              }
            >
              End Time
            </label>

            <input
              type="time"

              name="endTime"

              id={
                `${type}-endTime`
              }

              value={
                formData.endTime
              }

              onChange={
                handleChange
              }

              required

              disabled={
                isSubmitting
              }
            />

          </div>

        </div>


        <div
          className={
            styles.reasonInput
          }
        >

          <label
            htmlFor={
              `${type}-reason`
            }
          >

            Reason

            {
              reasonRequired &&
              " *"
            }

          </label>

          <textarea
            name="reason"

            id={
              `${type}-reason`
            }

            rows={5}

            value={
              formData.reason
            }

            onChange={
              handleChange
            }

            required={
              reasonRequired
            }

            disabled={
              isSubmitting
            }

            placeholder={
              reasonRequired
                ? "Please enter a reason"
                : "Reason (optional)"
            }
          />

        </div>


        <button
          type="submit"

          disabled={
            isSubmitting ||
            isLoadingDates
          }
        >

          {
            isSubmitting
              ? "Submitting..."
              : "Submit"
          }

        </button>

      </form>

    </div>

  );
};


export default LeaveRequest;