import logo from "../../assets/makans ltd logo.png";

import styles from "./LoadingScreen.module.css";

type LoadingScreenProps = {
  message?: string;
  description?: string;
};

const LoadingScreen = ({
  message = "Loading...",
  description = "Please wait while we process your request",
}: LoadingScreenProps) => {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingContent}>

        <div className={styles.logoContainer}>

          <div className={styles.spinner} />

          <div className={styles.logoWrapper}>
            <img
              src={logo}
              alt="Makans Ltd"
              className={styles.logo}
            />
          </div>

        </div>

        <h2 className={styles.loadingTitle}>
          {message}
        </h2>

        <p className={styles.loadingDescription}>
          {description}
        </p>

      </div>
    </div>
  );
};

export default LoadingScreen;