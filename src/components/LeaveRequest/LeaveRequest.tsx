import {
  useState,
} from "react";

import Calendar from "../Calendar/Calendar";

import styles from "./LeaveRequest.module.css";


type LeaveType =
  | "holiday"
  | "sick"
  | "emergency";


type LeaveRequestProps = {
  type: LeaveType;
  title: string;
};


type LeaveFormData = {
  dates: Date[];
  startTime: string;
  endTime: string;
  reason: string;
  type: LeaveType;
};


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
  // FORM DATA
  // =========================

  const [
    formData,
    setFormData,
  ] = useState<LeaveFormData>({
    dates: [],
    startTime: "",
    endTime: "",
    reason: "",
    type,
  });


  // =========================
  // REASON REQUIRED
  // =========================

  const reasonRequired =
    type === "sick" ||
    type === "emergency";


  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (
    event:
      React.ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement
      >
  ) => {

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

  const handleSubmit = (
    event:
      React.SubmitEvent<HTMLFormElement>
  ) => {

    event.preventDefault();


    // =========================
    // DATE VALIDATION
    // =========================

    if (
      selectedDates.length === 0
    ) {

      alert(
        "Please select at least one date."
      );

      return;

    }


    // =========================
    // REASON VALIDATION
    // =========================

    if (
      reasonRequired &&
      !formData.reason.trim()
    ) {

      alert(
        "Please enter a reason."
      );

      return;

    }


    // =========================
    // SUBMITTED DATA
    // =========================

    const submittedData:
      LeaveFormData = {

        ...formData,

        dates:
          selectedDates,

        type,
      };


    console.log(
      
      submittedData
    );

  };


  return (

    <div
      className={
        styles.leaveContainer
      }
    >

      {/* =========================
          TITLE
         ========================= */}

      <h1>
        {title}
      </h1>


      {/* =========================
          CALENDAR
         ========================= */}

      <Calendar
        multipleSelect

        selectedDates={
          selectedDates
        }

        onDatesSelect={
          setSelectedDates
        }

        days={30}

        disablePreviousMonths
      />


      {/* =========================
          FORM
         ========================= */}

      <form
        className={
          styles.leaveForm
        }
        onSubmit={
          handleSubmit
        }
      >

        {/* =========================
            TIME INPUTS
           ========================= */}

        <div
          className={
            styles.dateInputs
          }
        >

          {/* START TIME */}

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
            />

          </div>


          {/* END TIME */}

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
            />

          </div>

        </div>


        {/* =========================
            REASON
           ========================= */}

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

            placeholder={
              reasonRequired
                ? "Please enter a reason"
                : "Reason (optional)"
            }
          />

        </div>


        {/* =========================
            SUBMIT
           ========================= */}

        <button
          type="submit"
        >
          Submit
        </button>

      </form>

    </div>

  );

};


export default LeaveRequest;