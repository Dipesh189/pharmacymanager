import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

import styles from "./SignaturePad.module.css";


type SignaturePadProps = {
  onChange?: (signatureData: unknown[]) => void;
};


const SignaturePad = ({
  onChange,
}: SignaturePadProps) => {

  const signatureRef =
    useRef<SignatureCanvas>(null);


  const handleClear = () => {

    signatureRef.current?.clear();

    onChange?.([]);

  };


  const handleEnd = () => {

    const signature =
      signatureRef.current;

    if (!signature) {
      return;
    }


    const data =
      signature.toData();


    onChange?.(data);

  };


  return (
    <div className={styles.signatureContainer}>

      <div className={styles.signatureBox}>

        <SignatureCanvas
          ref={signatureRef}

          onEnd={handleEnd}

          canvasProps={{
            className:
              styles.signatureCanvas,
          }}
        />

      </div>


      <div className={styles.signatureActions}>

        <button
          type="button"
          className={styles.clearButton}
          onClick={handleClear}
        >
          Clear
        </button>

      </div>

    </div>
  );

};


export default SignaturePad;