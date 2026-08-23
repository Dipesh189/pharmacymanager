import { useState } from "react";
import styles from "./Order.module.css"

import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";


const Order = () => {

  const [isLoading, setIsLoading] =
    useState(false);


  const handleSubmit = async () => {

    setIsLoading(true);

    try {

      // Temporary fake API request
      // Wait for 3 seconds

      await new Promise((resolve) =>
        setTimeout(resolve, 3000)
      );

      console.log("Finished");

    } catch (error) {

      console.error(error);

    } finally {

      setIsLoading(false);

    }
  };


  return (
    <>

      {isLoading && (
        <LoadingScreen
          message="Submitting..."
          description="Please wait while we process your order"
        />
      )}


      <div className={styles.orderContainer}>

        <div className={styles.tableHeader}>Item In Stock</div>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Amlodipine 5mg tab (28)</td>
              <td><input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    onInput={(e) => {
      e.currentTarget.value =
        e.currentTarget.value.replace(/\D/g, "");
    }}
  /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
  type="button"
  className={styles.submitButton}
  onClick={handleSubmit}
  disabled={isLoading}
>
  Submit Order
</button>

      </div>

    </>
  );
};

export default Order;