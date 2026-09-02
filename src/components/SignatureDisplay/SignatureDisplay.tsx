import styles from "./SignatureDisplay.module.css";


type SignaturePoint = {
  x: number;
  y: number;
  time?: number;
  color?: string;
};


type SignatureDisplayProps = {
  signature:
    | SignaturePoint[][]
    | string
    | null;
};


const SignatureDisplay = ({
  signature,
}: SignatureDisplayProps) => {

  // =========================
  // NO SIGNATURE
  // =========================

  if (!signature) {

    return (
      <span className={styles.noSignature}>
        -
      </span>
    );

  }


  try {

    // =========================
    // PARSE DATA
    // =========================

    const signatureData:
      SignaturePoint[][] =
      typeof signature === "string"
        ? JSON.parse(signature)
        : signature;


    if (
      !Array.isArray(signatureData) ||
      signatureData.length === 0
    ) {

      return (
        <span className={styles.noSignature}>
          -
        </span>
      );

    }


    // =========================
    // GET ALL POINTS
    // =========================

    const allPoints =
      signatureData.flat();


    if (allPoints.length === 0) {

      return (
        <span className={styles.noSignature}>
          -
        </span>
      );

    }


    // =========================
    // GET SIGNATURE BOUNDS
    // =========================

    const minX =
      Math.min(
        ...allPoints.map(
          (point) => point.x
        )
      );


    const maxX =
      Math.max(
        ...allPoints.map(
          (point) => point.x
        )
      );


    const minY =
      Math.min(
        ...allPoints.map(
          (point) => point.y
        )
      );


    const maxY =
      Math.max(
        ...allPoints.map(
          (point) => point.y
        )
      );


    const width =
      Math.max(
        maxX - minX,
        1
      );


    const height =
      Math.max(
        maxY - minY,
        1
      );


    // Padding around signature
    const padding = 10;


    const viewBox = `
      ${minX - padding}
      ${minY - padding}
      ${width + padding * 2}
      ${height + padding * 2}
    `;


    // =========================
    // DISPLAY SIGNATURE
    // =========================

    return (

      <div
        className={
          styles.signatureDisplay
        }
      >

        <svg
          className={
            styles.signatureSvg
          }
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
        >

          {
            signatureData.map(
              (
                stroke,
                strokeIndex
              ) => {

                if (
                  !Array.isArray(stroke) ||
                  stroke.length === 0
                ) {
                  return null;
                }


                const points =
                  stroke
                    .map(
                      (point) =>
                        `${point.x},${point.y}`
                    )
                    .join(" ");


                return (

                  <polyline
                    key={strokeIndex}
                    points={points}

                    fill="none"

                    stroke={
                      stroke[0]?.color ||
                      "black"
                    }

                    strokeWidth="3"

                    strokeLinecap="round"

                    strokeLinejoin="round"
                  />

                );

              }
            )
          }

        </svg>

      </div>

    );


  } catch (error) {

    console.error(
      "SIGNATURE DISPLAY ERROR:",
      error
    );


    return (
      <span className={styles.noSignature}>
        -
      </span>
    );

  }

};


export default SignatureDisplay;