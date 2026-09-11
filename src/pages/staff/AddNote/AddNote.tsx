import {
  useEffect,
  useState,
} from "react";

import {
  apiFetch,
} from "../../../services/stafftimesheet";

import styles from "./AddNote.module.css";


type StaffNote = {
  id: number;
  note: string;
  created_by: string;
  created_at: string;
  status:
    | "In Progress"
    | "Resolved";
  resolved_at: string | null;
};


const AddNote = () => {

  // =========================
  // NOTE INPUT
  // =========================

  const [
    note,
    setNote,
  ] = useState("");


  // =========================
  // NOTES
  // =========================

  const [
    notes,
    setNotes,
  ] = useState<StaffNote[]>([]);


  // =========================
  // LOADING
  // =========================

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  // =========================
  // MESSAGES
  // =========================

  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  // =========================
  // FETCH NOTES
  // =========================

  const fetchNotes = async () => {

    setIsLoading(true);

    setError("");


    try {

      const response =
        await apiFetch(
          "/staff/notes/"
        );


      const data =
        await response.json();


      if (!response.ok) {

        setError(
          data.detail ||
          "Unable to load notes."
        );

        return;

      }


      setNotes(
        data.data || []
      );


    } catch (error) {

      console.error(
        "LOAD NOTES ERROR:",
        error
      );


      setError(
        "Unable to load notes."
      );


    } finally {

      setIsLoading(false);

    }

  };


  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    fetchNotes();

  }, []);


  // =========================
  // ADD NOTE
  // =========================

  const handleSubmit = async (
    event:
      React.SubmitEvent<HTMLFormElement>
  ) => {

    event.preventDefault();


    const noteText =
      note.trim();


    if (!noteText) {

      setError(
        "Please enter a note."
      );

      return;

    }


    setIsSaving(true);

    setError("");

    setSuccess("");


    try {

      const response =
        await apiFetch(
          "/staff/notes/",
          {
            method: "POST",

            body: JSON.stringify({
              note: noteText,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        setError(
          data.detail ||
          "Unable to add note."
        );

        return;

      }


      // Clear input

      setNote("");


      // Success message

      setSuccess(
        data.detail ||
        "Note added successfully."
      );


      // Add new note immediately
      // without another API request

      if (data.data) {

        setNotes(
          (previousNotes) => [
            data.data,
            ...previousNotes,
          ]
        );

      } else {

        // Fallback if backend
        // doesn't return note data

        await fetchNotes();

      }


    } catch (error) {

      console.error(
        "ADD NOTE ERROR:",
        error
      );


      setError(
        "Unable to add note."
      );


    } finally {

      setIsSaving(false);

    }

  };


  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (
    date: string
  ) => {

    return new Date(
      date
    ).toLocaleString(
      "en-GB",
      {
        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit",
      }
    );

  };


  return (

    <div
      className={
        styles.addNotePage
      }
    >

      {/* =========================
          TITLE
         ========================= */}

      <h1>
        Staff Notes
      </h1>


      {/* =========================
          ADD NOTE FORM
         ========================= */}

      <form
        className={
          styles.noteForm
        }
        onSubmit={
          handleSubmit
        }
      >

        <label
          htmlFor="note"
        >
          Add Note
        </label>


        <textarea
          id="note"
          name="note"
          rows={5}
          value={
            note
          }
          onChange={
            (event) =>
              setNote(
                event.target.value
              )
          }
          placeholder="Enter your note..."
          disabled={
            isSaving
          }
        />


        <button
          type="submit"
          disabled={
            isSaving ||
            !note.trim()
          }
        >

          {
            isSaving
              ? "Adding..."
              : "Add Note"
          }

        </button>

      </form>


      {/* =========================
          ERROR
         ========================= */}

      {
        error && (

          <div
            className={
              styles.error
            }
          >
            {error}
          </div>

        )
      }


      {/* =========================
          SUCCESS
         ========================= */}

      {
        success && (

          <div
            className={
              styles.success
            }
          >
            {success}
          </div>

        )
      }


      {/* =========================
          NOTES SECTION
         ========================= */}

      <div
        className={
          styles.notesSection
        }
      >

        <h2>
          All Notes
        </h2>


        {/* =========================
            LOADING
           ========================= */}

        {
          isLoading ? (

            <div
              className={
                styles.message
              }
            >
              Loading notes...
            </div>

          ) : notes.length === 0 ? (

            /* =========================
               NO NOTES
               ========================= */

            <div
              className={
                styles.message
              }
            >
              No notes available.
            </div>

          ) : (

            /* =========================
               NOTES LIST
               ========================= */

            <div
              className={
                styles.notesList
              }
            >

              {
                notes.map(
                  (staffNote) => {

                    const isResolved =
                      staffNote.status ===
                      "Resolved";


                    return (

                      <div
                        key={
                          staffNote.id
                        }
                        className={`
                          ${styles.noteCard}
                          ${
                            isResolved
                              ? styles.resolvedNote
                              : styles.inProgressNote
                          }
                        `}
                      >

                        {/* =========================
                            NOTE HEADER
                           ========================= */}

                        <div
                          className={
                            styles.noteHeader
                          }
                        >

                          <span
                            className={`
                              ${styles.status}
                              ${
                                isResolved
                                  ? styles.resolvedStatus
                                  : styles.inProgressStatus
                              }
                            `}
                          >

                            {
                              staffNote.status
                            }

                          </span>


                          <span
                            className={
                              styles.date
                            }
                          >

                            {
                              formatDate(
                                staffNote.created_at
                              )
                            }

                          </span>

                        </div>


                        {/* =========================
                            NOTE TEXT
                           ========================= */}

                        <p
                          className={
                            styles.noteText
                          }
                        >

                          {
                            staffNote.note
                          }

                        </p>


                        {/* =========================
                            RESOLVED DATE
                           ========================= */}

                        {
                          isResolved &&
                          staffNote.resolved_at && (

                            <div
                              className={
                                styles.resolvedDate
                              }
                            >

                              Resolved:{" "}
                              {
                                formatDate(
                                  staffNote.resolved_at
                                )
                              }

                            </div>

                          )
                        }


                        {/* =========================
                            CREATED BY
                           ========================= */}

                        <div
                          className={
                            styles.createdBy
                          }
                        >

                          Added by{" "}

                          <strong>
                            {
                              staffNote.created_by
                            }
                          </strong>

                        </div>

                      </div>

                    );

                  }
                )
              }

            </div>

          )
        }

      </div>

    </div>

  );

};


export default AddNote;