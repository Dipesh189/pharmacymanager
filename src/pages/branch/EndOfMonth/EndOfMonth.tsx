import Input from "../../../components/Input/Input";
import { useState } from "react";
import styles from "./EndOFMonth.module.css";
import { apiFetch } from "../../../services/stafftimesheet";


type EndofMonthfields={
  "EPS_Exempt_Forms":number,
  "EPS_Exempt_Items":number,
  "EPS_Paid_Forms":number,
  "EPS_Paid_Items":number,
  "Color_Exempt_Forms":number,
  "Color_Exempt_Items":number,
  "Color_Paid_Forms":number,
  "Color_Paid_Items":number,
  "Blue_Exempt_Forms":number,
  "Blue_Exempt_Items":number,
  "Blue_Paid_Forms":number,
  "Blue_Paid_Items":number,
  "NMS_Intervention":number,
  "NMS_Followup":number,
  "FReturn_Items":number,
  "NReturn_Forms":number,
}

const initialEndofMonthFields:EndofMonthfields={
  "EPS_Exempt_Forms":0,
  "EPS_Exempt_Items":0,
  "EPS_Paid_Forms":0,
  "EPS_Paid_Items":0,
  "Color_Exempt_Forms":0,
  "Color_Exempt_Items":0,
  "Color_Paid_Forms":0,
  "Color_Paid_Items":0,
  "Blue_Exempt_Forms":0,
  "Blue_Exempt_Items":0,
  "Blue_Paid_Forms":0,
  "Blue_Paid_Items":0,
  "NMS_Intervention":0,
  "NMS_Followup":0,
  "FReturn_Items":0,
  "NReturn_Forms":0,
}
type childrenType={
  name:keyof EndofMonthfields,
  label:string}

type EndofMonthFormtype={
  name:string,
  children:childrenType[]
}
 const fields:EndofMonthFormtype[]=[
  {
    name:"EPS",
    children: [
      { name: "EPS_Exempt_Forms", label: "Exempt Forms" },
      { name: "EPS_Exempt_Items", label: "Exempt Items" },
      { name: "EPS_Paid_Forms", label: "Paid Forms" },
      { name: "EPS_Paid_Items", label: "Paid Items" }
    ]
  },
  {
    name:"Color",
    children: [
      { name: "Color_Exempt_Forms", label: "Exempt Forms" },
      { name: "Color_Exempt_Items", label: "Exempt Items" },
      { name: "Color_Paid_Forms", label: "Paid Forms" },
      { name: "Color_Paid_Items", label: "Paid Items" }
    ]
  },
  {
    name:"Blue",
    children: [
      { name: "Blue_Exempt_Forms", label: "Exempt Forms" },
      { name: "Blue_Exempt_Items", label: "Exempt Items" },
      { name: "Blue_Paid_Forms", label: "Paid Forms" },
      { name: "Blue_Paid_Items", label: "Paid Items" }
    ]
  },
  {
    name:"NMS",
    children: [
      { name: "NMS_Intervention", label: "Intervention" },
      { name: "NMS_Followup", label: "Followup" }
    ]
  },
  {
    name:"Prx Refund",
    children: [
      { name: "FReturn_Items", label: "Items" },
      { name: "NReturn_Forms", label: "Forms" }
    ]
  }
]

const EndOfMonth = () => {
  const [endofMonthFields, setEndofMonthFields] =
    useState<EndofMonthfields>(initialEndofMonthFields);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const submittedData = {
      ...endofMonthFields,

      AReturn_Amount: Number(
        (endofMonthFields.FReturn_Items * 9.9).toFixed(2)
      ),
    };

    try {
      const response = await apiFetch(
        "/branch/endofmonth-add/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(submittedData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Submit error:", data);

        alert(
          data.detail ||
            "Unable to save the end-of-month report."
        );

        return;
      }

      console.log(
        "Submitted End-of-Month Data:",
        submittedData
      );

      alert(
        data.detail ||
          "End-of-month report saved successfully."
      );

      setEndofMonthFields(initialEndofMonthFields);
    } catch (error) {
      console.error("Request error:", error);
      alert("Unable to save the end-of-month report.");
    }
  };

  return (
    <div className={styles.EndOfMonthContainer}>
      <h1>End of Month</h1>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div
            key={field.name}
            className={styles.fieldGroup}
          >
            <h2>{field.name}</h2>

            <div className={styles.childrenContainer}>
              {field.children.map((child) => (
                <Input
                  key={child.name}
                  label={child.label}
                  id={child.name}
                  name={child.name}
                  type="number"
                  min="0"
                  step="1"
                  value={endofMonthFields[child.name]}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    setEndofMonthFields((previous) => ({
                      ...previous,
                      [child.name]: value,
                    }));
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className={styles.submitButton}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EndOfMonth;