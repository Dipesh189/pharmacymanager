import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import { apiFetch } from "../../../services/stafftimesheet";

import SignaturePad from "../../../components/SignaturePad/SignaturePad";

import styles from "./SopView.module.css";


pdfjs.GlobalWorkerOptions.workerSrc =
  pdfWorker;


type SopRecord = {
  sop_id: string;
  sop_title: string;
  file: string | null;
};


const DJANGO_URL =
  "http://127.0.0.1:8000";


const SopView = () => {

  const { sopId } =
    useParams();

  const navigate =
    useNavigate();


  const [sop, setSop] =
    useState<SopRecord | null>(null);

  const [pdfUrl, setPdfUrl] =
    useState("");

  const [numPages, setNumPages] =
    useState(0);

  const [signature, setSignature] =
    useState<unknown[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================
  // LOAD SOP
  // =========================

  useEffect(() => {

    if (!sopId) {
      return;
    }


    const fetchSop = async () => {

      setIsLoading(true);
      setError("");


      try {

        const response =
          await apiFetch(
            `/staff/sop/${encodeURIComponent(
              sopId
            )}/view/`
          );


        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.detail ||
            "Unable to load SOP."
          );

          return;
        }


        const sopData: SopRecord =
          data.data;


        setSop(
          sopData
        );


        if (!sopData.file) {

          setError(
            "PDF file not available."
          );

          return;
        }


        const fullPdfUrl =
          sopData.file.startsWith(
            "http"
          )
            ? sopData.file
            : `${DJANGO_URL}${sopData.file}`;


        setPdfUrl(
          fullPdfUrl
        );


      } catch (error) {

        console.error(
          "SOP load error:",
          error
        );


        setError(
          "Unable to load SOP."
        );


      } finally {

        setIsLoading(false);

      }

    };


    fetchSop();

  }, [sopId]);


  // =========================
  // PDF LOADED
  // =========================

  const handlePdfLoadSuccess = ({
    numPages,
  }: {
    numPages: number;
  }) => {

    setNumPages(
      numPages
    );

  };


  // =========================
  // SIGNATURE CHANGE
  // =========================

  const handleSignatureChange = (
    data: unknown[]
  ) => {

    setSignature(
      data
    );

    // Clear old messages
    setError("");
    setSuccess("");

  };


  // =========================
  // SAVE SIGNATURE
  // =========================

  const handleSave = async () => {

    if (!sopId) {

      setError(
        "SOP ID is missing."
      );

      return;
    }


    if (
      signature.length === 0
    ) {

      setError(
        "Please sign before saving."
      );

      return;
    }


    setIsSaving(true);

    setError("");

    setSuccess("");


    try {

      const response =
        await apiFetch(
          `/staff/sop/${encodeURIComponent(
            sopId
          )}/sign/`,
          {
            method: "POST",

            body: JSON.stringify({
              signature:
                signature,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        setError(
          data.detail ||
          "Unable to save signature."
        );

        return;
      }


      setSuccess(
        data.detail ||
        "SOP signed successfully."
      );


    } catch (error) {

      console.error(
        "SIGNATURE SAVE ERROR:",
        error
      );


      setError(
        "Unable to save signature."
      );


    } finally {

      setIsSaving(false);

    }

  };


  // =========================
  // LOADING
  // =========================

  if (isLoading) {

    return (

      <div
        className={
          styles.message
        }
      >
        Loading SOP...
      </div>

    );

  }


  return (

    <div
      className={
        styles.sopViewPage
      }
    >

      {/* =========================
          HEADER
         ========================= */}

      <div
        className={
          styles.header
        }
      >

        <div>

          <h2>
            {sop?.sop_title}
          </h2>


          <p>
            {sop?.sop_id}
          </p>

        </div>


        <button
          type="button"
          className={
            styles.backButton
          }
          onClick={
            () =>
              navigate(
                "/staff/sop"
              )
          }
        >
          Back to SOPs
        </button>

      </div>


      {/* =========================
          ERROR
         ========================= */}

      {error && (

        <div
          className={
            styles.error
          }
        >
          {error}
        </div>

      )}


      {/* =========================
          SUCCESS
         ========================= */}

      {success && (

        <div
          className={
            styles.success
          }
        >
          {success}
        </div>

      )}


      {/* =========================
          PDF
         ========================= */}

      <div
        className={
          styles.pdfContainer
        }
      >

        {
          pdfUrl ? (

            <Document
              file={
                pdfUrl
              }
              onLoadSuccess={
                handlePdfLoadSuccess
              }
              onLoadError={
                (error) => {

                  console.error(
                    "PDF LOAD ERROR:",
                    error
                  );


                  setError(
                    `Failed to load PDF: ${error.message}`
                  );

                }
              }
              loading={
                <div
                  className={
                    styles.message
                  }
                >
                  Loading PDF...
                </div>
              }
            >

              {
                Array.from(
                  {
                    length:
                      numPages,
                  },

                  (_, index) => (

                    <Page
                      key={
                        index + 1
                      }
                      pageNumber={
                        index + 1
                      }
                      width={
                        900
                      }
                      renderTextLayer={
                        false
                      }
                      renderAnnotationLayer={
                        false
                      }
                      className={
                        styles.pdfPage
                      }
                    />

                  )
                )
              }

            </Document>

          ) : (

            <div
              className={
                styles.message
              }
            >
              No PDF available.
            </div>

          )
        }

      </div>


      {/* =========================
          SIGNATURE
         ========================= */}

      <div
        className={
          styles.signatureSection
        }
      >

        <h3>
          Staff Signature
        </h3>


        <p>
          Please sign below to confirm
          that you have read this SOP.
        </p>


        <SignaturePad
          onChange={
            handleSignatureChange
          }
        />


        <button
          type="button"
          className={
            styles.saveButton
          }
          onClick={
            handleSave
          }
          disabled={
            isSaving ||
            signature.length === 0
          }
        >

          {
            isSaving
              ? "Saving..."
              : "Save Signature"
          }

        </button>

      </div>

    </div>

  );

};


export default SopView;