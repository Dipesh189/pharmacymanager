
import { useEffect, useState } from "react";

import Input from "../../../components/Input/Input";

import style from "./DailyServices.module.css";

type DailyServicesForm = {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
  field7: string;
  field8: string;
  field9: string;
  field10: string;
  field11: string;
  field12: string;
};

const DailyServices = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [formData, setFormData] = useState<DailyServicesForm>({
    field1: "",
    field2: "",
    field3: "",
    field4: "",
    field5: "",
    field6: "",
    field7: "",
    field8: "",
    field9: "",
    field10: "",
    field11: "",
    field12: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    console.log("Form Data:", formData);
  };

  return (
    <div className={style.dailyServices}>
      <h1>Daily Services</h1>

      <form
        className={style.form}
        onSubmit={handleSubmit}
      >
        <Input
          id="field1"
          label="Field 1"
          name="field1"
          value={formData.field1}
          onChange={handleChange}
        />

        <Input
          id="field2"
          label="Field 2"
          name="field2"
          value={formData.field2}
          onChange={handleChange}
        />

        <Input
          id="field3"
          label="Field 3"
          name="field3"
          value={formData.field3}
          onChange={handleChange}
        />

        <Input
          id="field4"
          label="Field 4"
          name="field4"
          value={formData.field4}
          onChange={handleChange}
        />

        <Input
          id="field5"
          label="Field 5"
          name="field5"
          value={formData.field5}
          onChange={handleChange}
        />

        <Input
          id="field6"
          label="Field 6"
          name="field6"
          value={formData.field6}
          onChange={handleChange}
        />

        <Input
          id="field7"
          label="Field 7"
          name="field7"
          value={formData.field7}
          onChange={handleChange}
        />

        <Input
          id="field8"
          label="Field 8"
          name="field8"
          value={formData.field8}
          onChange={handleChange}
        />

        <Input
          id="field9"
          label="Field 9"
          name="field9"
          value={formData.field9}
          onChange={handleChange}
        />

        <Input
          id="field10"
          label="Field 10"
          name="field10"
          value={formData.field10}
          onChange={handleChange}
        />

        <Input
          id="field11"
          label="Field 11"
          name="field11"
          value={formData.field11}
          onChange={handleChange}
        />

        <Input
          id="field12"
          label="Field 12"
          name="field12"
          value={formData.field12}
          onChange={handleChange}
        />

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