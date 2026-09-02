import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  apiFetch,
} from "../../../services/stafftimesheet";

import styles from "./Sop.module.css";


type SopRecord = {
  sop_id: string;
  sop_title: string;
  access_role?: string[];
  file?: string;
};


const Sop = () => {

  const [sops, setSops] =
    useState<SopRecord[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // =========================
  // LOAD SOPs
  // =========================

  useEffect(() => {

    const fetchSops = async () => {

      setIsLoading(true);
      setError("");

      try {

        const response =
          await apiFetch(
            "/staff/sop/"
          );

        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.detail ||
            "Unable to load SOPs."
          );

          return;
        }


        setSops(
          data.data || []
        );

      } catch (error) {

        console.error(
          "SOP error:",
          error
        );

        setError(
          "Unable to load SOPs."
        );

      } finally {

        setIsLoading(false);

      }

    };


    fetchSops();

  }, []);


  return (

    <div className={styles.sopPage}>

      <div className={styles.header}>

        <h2>
          Standard Operating Procedures
        </h2>

        <p>
          Select an SOP to read and sign.
        </p>

      </div>


      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}


      {isLoading ? (

        <div className={styles.message}>
          Loading SOPs...
        </div>

      ) : (

        <div className={styles.tableContainer}>

          <table className={styles.sopTable}>

            <thead>

              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Access Role</th>
                <th>View</th>
              </tr>

            </thead>


            <tbody>

              {sops.length > 0 ? (

                sops.map((sop) => (

                  <tr key={sop.sop_id}>

                    <td>
                      {sop.sop_id}
                    </td>

                    <td>
                      {sop.sop_title}
                    </td>

                    <td>
                      {sop.access_role?.length
                        ? sop.access_role.join(", ")
                        : "-"
                      }
                    </td>

                    <td>

                      <Link
                        to={`/staff/sop/${encodeURIComponent(
                          sop.sop_id
                        )}`}
                        className={styles.viewButton}
                      >
                        Open
                      </Link>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={4}
                    className={styles.noRecords}
                  >
                    No SOPs available.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

};


export default Sop;