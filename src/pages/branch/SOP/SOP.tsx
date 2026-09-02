import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import { apiFetch } from "../../../services/stafftimesheet";

import styles from "./SOP.module.css";

import SignatureDisplay from "../../../components/SignatureDisplay/SignatureDisplay";


type SignaturePoint = {
  x: number;
  y: number;
  time?: number;
  color?: string;
};


type StaffSignature = {
  staff_id: number;
  staff_name: string;
  position: string | null;
  signed: boolean;

  signature:
    SignaturePoint[][] | null;

  signed_at:
    string | null;
};


type SopRecord = {
  sop_id: string;
  sop_title: string;
  category: string | null;
  staff: StaffSignature[];
};


const SOP = () => {

  // =========================
  // STATE
  // =========================

  const [
    sops,
    setSops
  ] =
    useState<SopRecord[]>([]);


  const [
    isLoading,
    setIsLoading
  ] =
    useState(true);


  const [
    error,
    setError
  ] =
    useState("");


  // =========================
  // LOAD BRANCH SOP DATA
  // =========================

  useEffect(() => {

    const fetchSops =
      async () => {

        setIsLoading(
          true
        );

        setError("");


        try {

          const response =
            await apiFetch(
              "/branch/sop/"
            );


          const data =
            await response.json();


          if (
            !response.ok
          ) {

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
            "BRANCH SOP ERROR:",
            error
          );


          setError(
            "Unable to connect to server."
          );


        } finally {

          setIsLoading(
            false
          );

        }

      };


    fetchSops();

  }, []);


  // =========================
  // FORMAT DATE
  // =========================

  const formatMonthYear = (
    date: string | null
  ) => {

    if (!date) {
      return "-";
    }


    const parsedDate =
      new Date(
        date
      );


    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        month: "long",
        year: "numeric",
      }
    );

  };


  // =========================
  // GROUP SOPs BY CATEGORY
  // =========================

  const groupedSops =
    sops.reduce<
      Record<
        string,
        SopRecord[]
      >
    >(
      (
        groups,
        sop
      ) => {

        const categoryName =
          sop.category?.trim() ||
          "General SOP";


        if (
          !groups[
            categoryName
          ]
        ) {

          groups[
            categoryName
          ] = [];

        }


        groups[
          categoryName
        ].push(
          sop
        );


        return groups;

      },
      {}
    );


  // =========================
  // LOADING
  // =========================

  if (
    isLoading
  ) {

    return (

      <div
        className={
          styles.tableContainer
        }
      >

        <div
          className={
            styles.tableHeader
          }
        >
          SOP Index Table
        </div>


        <div
          className={
            styles.message
          }
        >
          Loading SOPs...
        </div>

      </div>

    );

  }


  // =========================
  // ERROR
  // =========================

  if (
    error
  ) {

    return (

      <div
        className={
          styles.tableContainer
        }
      >

        <div
          className={
            styles.tableHeader
          }
        >
          SOP Index Table
        </div>


        <div
          className={
            styles.error
          }
        >
          {error}
        </div>

      </div>

    );

  }


  // =========================
  // RETURN
  // =========================

  return (

    <div
      className={
        styles.tableContainer
      }
    >

      {/* =========================
          HEADER
         ========================= */}

      <div
        className={
          styles.tableHeader
        }
      >
        SOP Index Table
      </div>


      {/* =========================
          TABLE
         ========================= */}

      <table
        className={
          styles.sopTable
        }
      >

        <thead>

          <tr>

            <th>
              ID
            </th>

            <th>
              Title
            </th>

            <th>
              Staff Name
            </th>

            <th>
              Signature
            </th>

            <th>
              Month-Year
            </th>

          </tr>

        </thead>


        <tbody>

          {
            sops.length ===
            0 ? (

              <tr>

                <td
                  colSpan={
                    5
                  }
                  className={
                    styles.fullRow
                  }
                >
                  No SOPs available
                </td>

              </tr>

            ) : (

              Object.entries(
                groupedSops
              ).map(
                ([
                  category,
                  categorySops,
                ]) => (

                  <CategoryGroup
                    key={
                      category
                    }
                    category={
                      category
                    }
                    sops={
                      categorySops
                    }
                    formatMonthYear={
                      formatMonthYear
                    }
                  />

                )
              )

            )
          }

        </tbody>

      </table>

    </div>

  );

};


// =========================
// CATEGORY GROUP PROPS
// =========================

type CategoryGroupProps = {

  category: string;

  sops: SopRecord[];

  formatMonthYear: (
    date: string | null
  ) => string;

};


// =========================
// CATEGORY GROUP
// =========================

const CategoryGroup = ({
  category,
  sops,
  formatMonthYear,
}: CategoryGroupProps) => {

  return (

    <>

      {/* =========================
          CATEGORY HEADER
         ========================= */}

      <tr>

        <td
          colSpan={
            5
          }
          className={
            styles.fullRow
          }
        >

          {
            category
          }

        </td>

      </tr>


      {/* =========================
          SOPs IN CATEGORY
         ========================= */}

      {
        sops.map(
          (sop) => (

            <SopRow
              key={
                sop.sop_id
              }
              sop={
                sop
              }
              formatMonthYear={
                formatMonthYear
              }
            />

          )
        )
      }

    </>

  );

};


// =========================
// SOP ROW PROPS
// =========================

type SopRowProps = {

  sop: SopRecord;

  formatMonthYear: (
    date: string | null
  ) => string;

};


// =========================
// SOP ROW
// =========================

const SopRow = ({
  sop,
  formatMonthYear,
}: SopRowProps) => {

  return (

    <tr>

      {/* =========================
          ID
         ========================= */}

      <td>
        {
          sop.sop_id
        }
      </td>


      {/* =========================
          TITLE / LINK
         ========================= */}

      <td>

        <Link
          to={
            `/branch/sop/${encodeURIComponent(
              sop.sop_id
            )}/view`
          }
          className={
            styles.sopLink
          }
        >

          {
            sop.sop_title
          }

        </Link>

      </td>


      {/* =========================
          STAFF NAME
         ========================= */}

      <td>

        {
          sop.staff.length >
          0 ? (

            <ul>

              {
                sop.staff.map(
                  (staff) => (

                    <li
                      key={
                        staff.staff_id
                      }
                    >

                      {
                        staff.staff_name
                      }

                    </li>

                  )
                )
              }

            </ul>

          ) : (

            "-"

          )
        }

      </td>


      {/* =========================
          SIGNATURE
         ========================= */}

      <td>

        {
          sop.staff.length >
          0 ? (

            <ul>

              {
                sop.staff.map(
                  (staff) => (

                    <li
                      key={
                        staff.staff_id
                      }
                    >

                      {
                        staff.signed &&
                        staff.signature ? (

                          <SignatureDisplay
                            signature={
                              staff.signature
                            }
                          />

                        ) : (

                          <span>
                            -
                          </span>

                        )
                      }

                    </li>

                  )
                )
              }

            </ul>

          ) : (

            "-"

          )
        }

      </td>


      {/* =========================
          MONTH / YEAR
         ========================= */}

      <td>

        {
          sop.staff.length >
          0 ? (

            <ul>

              {
                sop.staff.map(
                  (staff) => (

                    <li
                      key={
                        staff.staff_id
                      }
                    >

                      {
                        staff.signed

                          ? formatMonthYear(
                              staff.signed_at
                            )

                          : "-"
                      }

                    </li>

                  )
                )
              }

            </ul>

          ) : (

            "-"

          )
        }

      </td>

    </tr>

  );

};


export default SOP;