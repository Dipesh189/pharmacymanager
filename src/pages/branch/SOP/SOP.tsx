import styles from "./SOP.module.css";

const SOP = () => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}> SOP Index Table</div>
      <table className={styles.sopTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Staff Name</th>
            <th>Signature</th>
            <th>Month-Year</th>
          </tr>
        </thead>

        <tbody>
          <tr>
      <td
        colSpan={5}
        className={styles.fullRow}
      >
        Contrall Drug
      </td>
    </tr>
          <tr>
            <td>CD0-001</td>
            <td>CD Initial Checking Declaration</td>

            <td>
              <ul>
                <li>John Doe</li>
                <li>Dipesh</li>
              </ul>
            </td>

            <td>
              <ul>
                <li>_</li>
                <li>_</li>
              </ul>
            </td>
            <td>
              <ul>
                <li>July-2026</li>
                <li>July-2026</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SOP;