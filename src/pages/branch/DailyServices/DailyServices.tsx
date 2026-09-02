import {
  useEffect,
  useState,
} from "react";

import Input from "../../../components/Input/Input";

import style from "./DailyServices.module.css";
import { apiFetch } from "../../../services/stafftimesheet";

type InputValue = number | "";

type DailyServicesForm = {
  Received_Forms: InputValue;
  Received_Items: InputValue;
  Claimed_Forms: InputValue;
  Claimed_Items: InputValue;
  Inbox_Items: InputValue;
  Park_Items: InputValue;
  Pick_Items: InputValue;
  Label_Items: InputValue;
  Handout_Items: InputValue;
  NMS_Intervention: InputValue;
  NMS_Follow_Ups: InputValue;
  Extra_Blood_Pressure: InputValue;
  Extra_Minor_Illness: InputValue;
  Extra_Pharmacy_First: InputValue;
  Extra_Contraception: InputValue;
  Extra_MenB_Vaccine: InputValue;
  Extra_Covid_Vaccine: InputValue;
  Extra_Travel_Vaccine: InputValue;
  Extra_WeightLoss_Consultation: InputValue;
  Extra_Vitamin_D_Test: InputValue;
  Extra_Blood_Sugar_Test: InputValue;
  Extra_Ear_Wax: InputValue;
};

type DailyServiceField = {
  name: keyof DailyServicesForm;
  label: string;
};

type SavedUser = {
  branch_name?: string;
};

const dailyServiceFormNames: DailyServiceField[] = [
  {
    name: "Received_Forms",
    label: "Received Forms",
  },
  {
    name: "Received_Items",
    label: "Received Items",
  },
  {
    name: "Claimed_Forms",
    label: "Claimed Forms",
  },
  {
    name: "Claimed_Items",
    label: "Claimed Items",
  },
  {
    name: "Inbox_Items",
    label: "Inbox Items",
  },
  {
    name: "Park_Items",
    label: "Park Items",
  },
  {
    name: "Pick_Items",
    label: "Pick Items",
  },
  {
    name: "Label_Items",
    label: "Label Items",
  },
  {
    name: "Handout_Items",
    label: "Handout Items",
  },
  {
    name: "NMS_Intervention",
    label: "NMS Intervention",
  },
  {
    name: "NMS_Follow_Ups",
    label: "NMS Follow Ups",
  },
  {
    name: "Extra_Blood_Pressure",
    label: "Blood Pressure",
  },
  {
    name: "Extra_Minor_Illness",
    label: "Minor Illness",
  },
  {
    name: "Extra_Pharmacy_First",
    label: "Pharmacy First",
  },
  {
    name: "Extra_Contraception",
    label: "Contraception",
  },
  {
    name: "Extra_MenB_Vaccine",
    label: "MenB Vaccine",
  },
  {
    name: "Extra_Covid_Vaccine",
    label: "COVID Vaccine",
  },
  {
    name: "Extra_Travel_Vaccine",
    label: "Travel Vaccine",
  },
  {
    name: "Extra_WeightLoss_Consultation",
    label: "Weight Loss Consultation",
  },
  {
    name: "Extra_Vitamin_D_Test",
    label: "Vitamin D Test",
  },
  {
    name: "Extra_Blood_Sugar_Test",
    label: "Blood Sugar Test",
  },
  {
    name: "Extra_Ear_Wax",
    label: "Ear Wax",
  },
];

const initialFormData: DailyServicesForm = {
  Received_Forms: 0,
  Received_Items: 0,
  Claimed_Forms: 0,
  Claimed_Items: 0,
  Inbox_Items: 0,
  Park_Items: 0,
  Pick_Items: 0,
  Label_Items: 0,
  Handout_Items: 0,
  NMS_Intervention: 0,
  NMS_Follow_Ups: 0,
  Extra_Blood_Pressure: 0,
  Extra_Minor_Illness: 0,
  Extra_Pharmacy_First: 0,
  Extra_Contraception: 0,
  Extra_MenB_Vaccine: 0,
  Extra_Covid_Vaccine: 0,
  Extra_Travel_Vaccine: 0,
  Extra_WeightLoss_Consultation: 0,
  Extra_Vitamin_D_Test: 0,
  Extra_Blood_Sugar_Test: 0,
  Extra_Ear_Wax: 0,
};

const branchesUsingForms = [
  "Makans Pharmacy",
  "Hockwell Ring Pharmacy",
];

const hiddenFieldsForFormsBranches: Array<
  keyof DailyServicesForm
> = [
 
  "Inbox_Items",
  "Park_Items",
  "Pick_Items",
  "Label_Items",
  "Handout_Items",
];

const DailyServices = () => {
  const [formData, setFormData] =
    useState<DailyServicesForm>(
      initialFormData,
    );

  let branchName = "Branch";

  const savedUser =
    localStorage.getItem("user");

  if (savedUser) {
    try {
      const user: SavedUser =
        JSON.parse(savedUser);

      branchName =
        user.branch_name || "Branch";
    } catch (error) {
      console.error(
        "Unable to read user:",
        error,
      );
    }
  }

  const usesForms =
    branchesUsingForms.includes(branchName);

  const filteredServiceFields =
    dailyServiceFormNames.filter((field) => {
      // Makans and Hockwell Ring:
      // show Forms and hide item workflow fields.
      if (usesForms) {
        return !hiddenFieldsForFormsBranches.includes(
          field.name,
        );
      }

      // All other branches:
      // hide Received Forms and Claimed Forms.
      return !field.name.includes("_Forms");
    });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const fieldName =
      event.currentTarget
        .name as keyof DailyServicesForm;

    const inputValue =
      event.currentTarget.value;

    const numericValue =
      event.currentTarget.valueAsNumber;

    setFormData((previous) => ({
      ...previous,

      [fieldName]:
        inputValue === ""
          ? ""
          : Math.trunc(numericValue),
    }));
  };

  const handleSubmit = async (
  event: React.SubmitEvent<HTMLFormElement>,
) => {

  event.preventDefault();

  const submittedData = {
    ...formData,
  };

  try {

    const response = await apiFetch(
      "/branch/dailyservice-add/",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(
          submittedData
        ),
      }
    );


    const data =
      await response.json();
      alert(data.detail)


    if (!response.ok) {

      console.error(
        "Submit error:",
        data
      );

      return;
    }




  } catch (error) {

    if (error instanceof Error) {
    alert("Unable to Save Daily Services");
  } else {
    alert("Something went wrong.");
  }


  }

};

  return (
    <div className={style.dailyServices}>
      <h1>Daily Services</h1>

      <form
        className={style.form}
        onSubmit={handleSubmit}
      >
        {filteredServiceFields.map(
          (field) => (
            <Input
              key={field.name}
              id={field.name}
              name={field.name}
              label={field.label}
              type="number"
              min={0}
              step={1}
              value={formData[field.name]}
              onChange={handleChange}
            />
          ),
        )}

        <button
          type="submit"
          className={style.submitButton}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DailyServices;