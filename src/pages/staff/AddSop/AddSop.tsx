import { useNavigate } from "react-router-dom";

import styles from "./AddSop.module.css";

const AddSop = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/staff/dashboard");
  };

  const handleUpload = () => {
    console.log("Upload SOP");
  };

  const handleDelete = () => {
    console.log("Delete SOP");
  };

  return (
    <div className={styles.appSopPage}>
      {/* =========================
          HEADER
         ========================= */}

      <div className={styles.header}>
        <div>
          <h1>SOP Management</h1>

          <p>Upload and manage staff SOPs</p>
        </div>

        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
        >
          Back
        </button>
      </div>

      {/* =========================
          ACTIONS
         ========================= */}

      <div className={styles.actionContainer}>
        <button
          type="button"
          className={styles.uploadButton}
          onClick={handleUpload}
        >
          Upload SOP
        </button>

        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      {/* =========================
          CONTENT
         ========================= */}

      <div className={styles.content}>
        <div className={styles.emptyState}>
          <h2>SOP Documents</h2>

          <p>Uploaded SOP documents will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default AddSop;
