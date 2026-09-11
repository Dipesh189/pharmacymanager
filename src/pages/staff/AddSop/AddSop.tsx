import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { apiFetch } from "../../../services/stafftimesheet";

import styles from "./AddSop.module.css";


type SopRecord = {
  sop_id: string;
  sop_title: string;
  category?: string;
  access_role?: string[];
  file?: string;
};


type Option = {
  name: string;
};


type SelectionType =
  | "role"
  | "category";


const AddSop = () => {

  // =========================
  // REFERENCES
  // =========================

  const fileInputRef =
    useRef<HTMLInputElement>(null);


  // =========================
  // STATE
  // =========================

  const [sops, setSops] =
    useState<SopRecord[]>([]);


  const [isLoading, setIsLoading] =
    useState(false);


  const [isUploading, setIsUploading] =
    useState(false);


  const [isSaving, setIsSaving] =
    useState(false);


  const [
    isCreatingCategory,
    setIsCreatingCategory
  ] =
    useState(false);


  const [error, setError] =
    useState("");


  // =========================
  // MODAL STATE
  // =========================

  const [
    isModalOpen,
    setIsModalOpen
  ] =
    useState(false);


  const [
    selectionType,
    setSelectionType
  ] =
    useState<SelectionType>(
      "role"
    );


  const [
    selectedSop,
    setSelectedSop
  ] =
    useState<SopRecord | null>(
      null
    );


  const [
    availableOptions,
    setAvailableOptions
  ] =
    useState<Option[]>([]);


  const [
    selectedRoles,
    setSelectedRoles
  ] =
    useState<string[]>([]);


  const [
    selectedCategory,
    setSelectedCategory
  ] =
    useState("");


  // =========================
  // NEW CATEGORY
  // =========================

  const [
    newCategory,
    setNewCategory
  ] =
    useState("");


  // =========================
  // FETCH ALL SOPs
  // =========================

  const fetchSops =
    useCallback(
      async () => {

        setIsLoading(true);
        setError("");


        try {

          const response =
            await apiFetch(
              "/staff/sop/",
              {
                method: "GET",
              }
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
            "SOP load error:",
            error
          );


          setError(
            "Unable to connect to the server."
          );


        } finally {

          setIsLoading(false);

        }

      },
      []
    );


  // =========================
  // LOAD SOPs
  // =========================

  useEffect(() => {

    fetchSops();

  }, [fetchSops]);


  // =========================
  // OPEN FILE PICKER
  // =========================

  const handleUploadClick = () => {

    fileInputRef.current?.click();

  };


  // =========================
  // UPLOAD SOP FILES
  // =========================

  const handleFileChange = async (
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {

    const files =
      event.target.files;


    if (
      !files ||
      files.length === 0
    ) {

      return;

    }


    const formData =
      new FormData();


    Array.from(files).forEach(
      (file) => {

        console.log(
          "Uploading:",
          file.name,
          file.size,
          file.type
        );


        formData.append(
          "sop_files",
          file
        );

      }
    );


    setIsUploading(true);
    setError("");


    try {

      const response =
        await apiFetch(
          "/staff/sop/upload/",
          {
            method: "POST",
            body: formData,
          }
        );


      console.log(
        "UPLOAD STATUS:",
        response.status
      );


      const responseText =
        await response.text();


      console.log(
        "UPLOAD RESPONSE:",
        responseText
      );


      let data:
        Record<string, any> = {};


      if (responseText) {

        try {

          data =
            JSON.parse(
              responseText
            );

        } catch {

          console.error(
            "Upload response is not JSON:",
            responseText
          );

        }

      }


      if (!response.ok) {

        console.error(
          "SOP UPLOAD FAILED:",
          {
            status:
              response.status,

            statusText:
              response.statusText,

            response:
              data,
          }
        );


        if (
          response.status === 401
        ) {

          setError(
            "Your login session has expired. Please log in again."
          );

          return;

        }


        if (
          response.status === 413
        ) {

          setError(
            "The SOP file is too large."
          );

          return;

        }


        if (
          response.status === 400
        ) {

          setError(
            data.detail ||
            data.error ||
            "The SOP file could not be uploaded. Please check the file."
          );

          return;

        }


        if (
          response.status >= 500
        ) {

          setError(
            data.detail ||
            data.error ||
            "Server error while uploading SOP."
          );

          return;

        }


        setError(
          data.detail ||
          data.error ||
          `Unable to upload SOP. Server returned ${response.status}.`
        );

        return;

      }


      console.log(
        "SOP UPLOAD SUCCESS:",
        data
      );


      await fetchSops();


    } catch (error) {

      console.error(
        "SOP upload error:",
        error
      );


      if (
        error instanceof Error
      ) {

        setError(
          `Unable to upload SOP: ${error.message}`
        );

      } else {

        setError(
          "Unable to upload SOP."
        );

      }


    } finally {

      setIsUploading(false);


      if (
        fileInputRef.current
      ) {

        fileInputRef.current.value =
          "";

      }

    }

  };


  // =========================
  // OPEN SELECTION MODAL
  // =========================

  const openSelectionModal =
    async (
      sop: SopRecord,
      type: SelectionType
    ) => {

      setSelectedSop(
        sop
      );


      setSelectionType(
        type
      );


      setAvailableOptions(
        []
      );


      setError("");


      setNewCategory(
        ""
      );


      if (
        type === "role"
      ) {

        setSelectedRoles(
          sop.access_role || []
        );

      } else {

        setSelectedCategory(
          sop.category || ""
        );

      }


      setIsModalOpen(
        true
      );


      try {

        const endpoint =
          type === "role"

            ? "/get-single-data/role/"

            : "/get-single-data/Catogery/";


        const response =
          await apiFetch(
            endpoint,
            {
              method: "GET",
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.detail ||
            `Unable to load ${type}s.`
          );


          setIsModalOpen(
            false
          );


          return;

        }


        const rawOptions =
          Array.isArray(data)

            ? data

            : data.data || [];


        const options: Option[] =
          rawOptions
            .map(
              (
                option:
                  Record<
                    string,
                    unknown
                  >
              ) => {

                if (
                  typeof option.name ===
                  "string"
                ) {

                  return {
                    name:
                      option.name,
                  };

                }


                if (
                  typeof option.type ===
                  "string"
                ) {

                  return {
                    name:
                      option.type,
                  };

                }


                return null;

              }
            )
            .filter(
              (
                option:
                  Option | null
              ): option is Option =>
                option !== null
            );


        setAvailableOptions(
          options
        );


      } catch (error) {

        console.error(
          "Options load error:",
          error
        );


        setError(
          `Unable to load available ${type}s.`
        );


        setIsModalOpen(
          false
        );

      }

    };


  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {

    if (
      isSaving ||
      isCreatingCategory
    ) {

      return;

    }


    setIsModalOpen(
      false
    );


    setSelectedSop(
      null
    );


    setAvailableOptions(
      []
    );


    setSelectedRoles(
      []
    );


    setSelectedCategory(
      ""
    );


    setNewCategory(
      ""
    );


    setError("");

  };


  // =========================
  // TOGGLE ROLE
  // =========================

  const toggleRole = (
    roleName: string
  ) => {

    setSelectedRoles(
      (currentRoles) => {

        const exists =
          currentRoles.includes(
            roleName
          );


        if (exists) {

          return currentRoles.filter(
            (role) =>
              role !== roleName
          );

        }


        return [
          ...currentRoles,
          roleName,
        ];

      }
    );

  };


  // =========================
  // ADD NEW CATEGORY
  // =========================

  const handleAddCategory =
    async () => {

      const categoryName =
        newCategory.trim();


      if (!categoryName) {

        setError(
          "Please enter a category name."
        );

        return;

      }


      const alreadyExists =
        availableOptions.some(
          (option) =>
            option.name
              .trim()
              .toLowerCase() ===
            categoryName
              .toLowerCase()
        );


      if (alreadyExists) {

        setError(
          "Category already exists."
        );

        return;

      }


      setIsCreatingCategory(
        true
      );


      setError("");


      try {

        const response =
          await apiFetch(
            "/staff/sop/category/create/",
            {
              method: "POST",

              body:
                JSON.stringify({
                  name:
                    categoryName,
                }),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.detail ||
            "Unable to create category."
          );

          return;

        }


        const createdName =
          data.data?.name ||
          categoryName;


        setAvailableOptions(
          (currentOptions) => {

            const exists =
              currentOptions.some(
                (option) =>
                  option.name ===
                  createdName
              );


            if (exists) {

              return currentOptions;

            }


            return [
              ...currentOptions,

              {
                name:
                  createdName,
              },
            ];

          }
        );


        setSelectedCategory(
          createdName
        );


        setNewCategory(
          ""
        );


      } catch (error) {

        console.error(
          "Create category error:",
          error
        );


        setError(
          "Unable to create category."
        );


      } finally {

        setIsCreatingCategory(
          false
        );

      }

    };


  // =========================
  // SAVE ROLE ACCESS
  // =========================

  const saveRoles =
    async (
      sop: SopRecord,
      roles: string[]
    ) => {

      const response =
        await apiFetch(
          `/staff/sop/${encodeURIComponent(
            sop.sop_id
          )}/roles/`,
          {
            method: "PATCH",

            body:
              JSON.stringify({
                roles:
                  roles,
              }),
          }
        );


      let data = null;


      try {

        data =
          await response.json();

      } catch {

        data = null;

      }


      if (!response.ok) {

        throw new Error(
          data?.detail ||
          "Unable to update SOP roles."
        );

      }


      return data;

    };


  // =========================
  // SAVE CATEGORY
  // =========================

  const saveCategory =
    async (
      sop: SopRecord,
      category: string
    ) => {

      const response =
        await apiFetch(
          `/staff/sop/${encodeURIComponent(
            sop.sop_id
          )}/category/`,
          {
            method: "PATCH",

            body:
              JSON.stringify({
                category:
                  category,
              }),
          }
        );


      let data = null;


      try {

        data =
          await response.json();

      } catch {

        data = null;

      }


      if (!response.ok) {

        throw new Error(
          data?.detail ||
          "Unable to update SOP category."
        );

      }


      return data;

    };


  // =========================
  // SAVE MODAL SELECTION
  // =========================

  const handleSaveSelection =
    async () => {

      if (
        !selectedSop
      ) {

        return;

      }


      if (
        selectionType ===
          "category" &&
        !selectedCategory
      ) {

        setError(
          "Please select a category."
        );

        return;

      }


      setIsSaving(
        true
      );


      setError("");


      try {

        // =========================
        // SAVE ROLE
        // =========================

        if (
          selectionType ===
          "role"
        ) {

          const data =
            await saveRoles(
              selectedSop,
              selectedRoles
            );


          const returnedRoles =
            data?.data
              ?.access_role ||

            data?.access_role ||

            selectedRoles;


          setSops(
            (currentSops) =>
              currentSops.map(
                (sop) => {

                  if (
                    sop.sop_id !==
                    selectedSop.sop_id
                  ) {

                    return sop;

                  }


                  return {
                    ...sop,

                    access_role:
                      returnedRoles,
                  };

                }
              )
          );


          setIsModalOpen(
            false
          );


          setSelectedSop(
            null
          );


          setAvailableOptions(
            []
          );


          setSelectedRoles(
            []
          );


          return;

        }


        // =========================
        // SAVE CATEGORY
        // =========================

        const data =
          await saveCategory(
            selectedSop,
            selectedCategory
          );


        const returnedCategory =
          data?.data
            ?.category ||

          data?.category ||

          selectedCategory;


        setSops(
          (currentSops) =>
            currentSops.map(
              (sop) => {

                if (
                  sop.sop_id !==
                  selectedSop.sop_id
                ) {

                  return sop;

                }


                return {
                  ...sop,

                  category:
                    returnedCategory,
                };

              }
            )
        );


        setIsModalOpen(
          false
        );


        setSelectedSop(
          null
        );


        setAvailableOptions(
          []
        );


        setSelectedCategory(
          ""
        );


        setNewCategory(
          ""
        );


      } catch (error) {

        console.error(
          "SOP update error:",
          error
        );


        if (
          error instanceof Error
        ) {

          setError(
            error.message
          );

        } else {

          setError(
            "Unable to update SOP."
          );

        }


      } finally {

        setIsSaving(
          false
        );

      }

    };


  // =========================
  // REMOVE ONE ROLE
  // =========================

  const handleRemoveRole =
    async (
      sop: SopRecord,
      roleToRemove: string
    ) => {

      const updatedRoles =
        (
          sop.access_role ||
          []
        ).filter(
          (role) =>
            role !==
            roleToRemove
        );


      setError("");


      try {

        const data =
          await saveRoles(
            sop,
            updatedRoles
          );


        const returnedRoles =
          data?.data
            ?.access_role ||

          data?.access_role ||

          updatedRoles;


        setSops(
          (currentSops) =>
            currentSops.map(
              (currentSop) => {

                if (
                  currentSop.sop_id !==
                  sop.sop_id
                ) {

                  return currentSop;

                }


                return {
                  ...currentSop,

                  access_role:
                    returnedRoles,
                };

              }
            )
        );


      } catch (error) {

        console.error(
          "Remove role error:",
          error
        );


        if (
          error instanceof Error
        ) {

          setError(
            error.message
          );

        } else {

          setError(
            "Unable to remove role."
          );

        }

      }

    };


  // =========================
  // REMOVE CATEGORY
  // =========================

  const handleRemoveCategory =
    async (
      sop: SopRecord
    ) => {

      console.log(
        "Remove category:",
        sop.sop_id
      );


      setError(
        "Category removal endpoint not configured yet."
      );

    };


  // =========================
  // DELETE SOP
  // =========================

  const handleDelete =
    async (
      sopId: string
    ) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this SOP?"
        );


      if (
        !confirmed
      ) {

        return;

      }


      setError("");


      try {

        const response =
          await apiFetch(
            `/staff/sop/${encodeURIComponent(
              sopId
            )}/`,
            {
              method: "DELETE",
            }
          );


        if (!response.ok) {

          let detail =
            "Unable to delete SOP.";


          try {

            const data =
              await response.json();


            detail =
              data.detail ||
              detail;


          } catch {

            // No JSON response

          }


          setError(
            detail
          );


          return;

        }


        setSops(
          (currentSops) =>
            currentSops.filter(
              (sop) =>
                sop.sop_id !==
                sopId
            )
        );


      } catch (error) {

        console.error(
          "Delete SOP error:",
          error
        );


        setError(
          "Unable to delete SOP."
        );

      }

    };


  // =========================
  // RETURN
  // =========================

  return (

    <div
      className={
        styles.addSopPage
      }
    >

      <div
        className={
          styles.header
        }
      >

        <div>

          <h1>
            SOP Management
          </h1>


          <p>
            Upload and manage staff SOPs
          </p>

        </div>


        <button
          type="button"
          className={
            styles.uploadButton
          }
          onClick={
            handleUploadClick
          }
          disabled={
            isUploading
          }
        >

          {
            isUploading
              ? "Uploading..."
              : "Upload SOP"
          }

        </button>


        <input
          ref={
            fileInputRef
          }
          type="file"
          multiple
          className={
            styles.fileInput
          }
          onChange={
            handleFileChange
          }
        />

      </div>


      {
        error && (

          <div
            className={
              styles.errorMessage
            }
          >
            {error}
          </div>

        )
      }


      <div
        className={
          styles.content
        }
      >

        {
          isLoading ? (

            <div
              className={
                styles.message
              }
            >
              Loading SOPs...
            </div>

          ) : sops.length ===
            0 ? (

            <div
              className={
                styles.emptyState
              }
            >

              <h2>
                No SOP Documents
              </h2>


              <p>
                Upload an SOP document
                to get started.
              </p>

            </div>

          ) : (

            <div
              className={
                styles.tableContainer
              }
            >

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
                      Category
                    </th>

                    <th>
                      Access Role
                    </th>

                    <th>
                      Remove
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {
                    sops.map(
                      (sop) => (

                        <tr
                          key={
                            sop.sop_id
                          }
                        >

                          <td>
                            {
                              sop.sop_id
                            }
                          </td>


                          <td>
                            {
                              sop.sop_title
                            }
                          </td>


                          <td>

                            <div
                              className={
                                styles.tagContainer
                              }
                            >

                              {
                                sop.category && (

                                  <span
                                    className={
                                      styles.tag
                                    }
                                  >

                                    <span>
                                      {
                                        sop.category
                                      }
                                    </span>


                                    <button
                                      type="button"
                                      className={
                                        styles.removeTagButton
                                      }
                                      onClick={
                                        () =>
                                          handleRemoveCategory(
                                            sop
                                          )
                                      }
                                      title="Remove category"
                                      aria-label="Remove category"
                                    >
                                      ×
                                    </button>

                                  </span>

                                )
                              }


                              <button
                                type="button"
                                className={
                                  styles.addTagButton
                                }
                                onClick={
                                  () =>
                                    openSelectionModal(
                                      sop,
                                      "category"
                                    )
                                }
                                title={
                                  sop.category
                                    ? "Change category"
                                    : "Add category"
                                }
                                aria-label={
                                  sop.category
                                    ? "Change category"
                                    : "Add category"
                                }
                              >
                                +
                              </button>

                            </div>

                          </td>


                          <td>

                            <div
                              className={
                                styles.tagContainer
                              }
                            >

                              {
                                (
                                  sop.access_role ||
                                  []
                                ).map(
                                  (role) => (

                                    <span
                                      key={
                                        role
                                      }
                                      className={
                                        styles.tag
                                      }
                                    >

                                      <span>
                                        {
                                          role
                                        }
                                      </span>


                                      <button
                                        type="button"
                                        className={
                                          styles.removeTagButton
                                        }
                                        onClick={
                                          () =>
                                            handleRemoveRole(
                                              sop,
                                              role
                                            )
                                        }
                                        title={
                                          `Remove ${role}`
                                        }
                                        aria-label={
                                          `Remove ${role}`
                                        }
                                      >
                                        ×
                                      </button>

                                    </span>

                                  )
                                )
                              }


                              <button
                                type="button"
                                className={
                                  styles.addTagButton
                                }
                                onClick={
                                  () =>
                                    openSelectionModal(
                                      sop,
                                      "role"
                                    )
                                }
                                title="Add roles"
                                aria-label="Add roles"
                              >
                                +
                              </button>

                            </div>

                          </td>


                          <td>

                            <button
                              type="button"
                              className={
                                styles.deleteButton
                              }
                              onClick={
                                () =>
                                  handleDelete(
                                    sop.sop_id
                                  )
                              }
                            >
                              Delete
                            </button>

                          </td>

                        </tr>

                      )
                    )
                  }

                </tbody>

              </table>

            </div>

          )
        }

      </div>


      {
        isModalOpen &&
        selectedSop && (

          <div
            className={
              styles.modalOverlay
            }
            onMouseDown={
              closeModal
            }
          >

            <div
              className={
                styles.modal
              }
              role="dialog"
              aria-modal="true"
              aria-labelledby="selection-modal-title"
              onMouseDown={
                (event) =>
                  event.stopPropagation()
              }
            >

              <div
                className={
                  styles.modalHeader
                }
              >

                <div>

                  <h2
                    id="selection-modal-title"
                  >

                    {
                      selectionType ===
                      "role"
                        ? "Select Access Roles"
                        : "Select Category"
                    }

                  </h2>


                  <p>
                    {
                      selectedSop.sop_title
                    }
                  </p>

                </div>


                <button
                  type="button"
                  className={
                    styles.closeModalButton
                  }
                  onClick={
                    closeModal
                  }
                  disabled={
                    isSaving ||
                    isCreatingCategory
                  }
                  aria-label="Close"
                >
                  ×
                </button>

              </div>


              {
                selectionType ===
                "category" && (

                  <div
                    className={
                      styles.addCategoryBox
                    }
                  >

                    <input
                      type="text"
                      value={
                        newCategory
                      }
                      onChange={
                        (event) =>
                          setNewCategory(
                            event.target.value
                          )
                      }
                      onKeyDown={
                        (event) => {

                          if (
                            event.key ===
                            "Enter"
                          ) {

                            event.preventDefault();

                            handleAddCategory();

                          }

                        }
                      }
                      placeholder="New category name"
                      className={
                        styles.categoryInput
                      }
                      disabled={
                        isCreatingCategory
                      }
                    />


                    <button
                      type="button"
                      className={
                        styles.addCategoryButton
                      }
                      onClick={
                        handleAddCategory
                      }
                      disabled={
                        isCreatingCategory ||
                        !newCategory.trim()
                      }
                    >

                      {
                        isCreatingCategory
                          ? "Adding..."
                          : "Add Category"
                      }

                    </button>

                  </div>

                )
              }


              <div
                className={
                  styles.optionList
                }
              >

                {
                  availableOptions.length ===
                  0 ? (

                    <p
                      className={
                        styles.modalMessage
                      }
                    >

                      {
                        selectionType ===
                        "category"
                          ? "No categories available."
                          : "Loading options..."
                      }

                    </p>

                  ) : (

                    availableOptions.map(
                      (option) => (

                        <label
                          key={
                            option.name
                          }
                          className={
                            styles.optionItem
                          }
                        >

                          <input
                            type={
                              selectionType ===
                              "role"
                                ? "checkbox"
                                : "radio"
                            }
                            name={
                              selectionType ===
                              "category"
                                ? "sop-category"
                                : undefined
                            }
                            value={
                              option.name
                            }
                            checked={
                              selectionType ===
                              "role"

                                ? selectedRoles.includes(
                                    option.name
                                  )

                                : selectedCategory ===
                                  option.name
                            }
                            onChange={
                              () => {

                                if (
                                  selectionType ===
                                  "role"
                                ) {

                                  toggleRole(
                                    option.name
                                  );

                                } else {

                                  setSelectedCategory(
                                    option.name
                                  );

                                }

                              }
                            }
                          />


                          <span>
                            {
                              option.name
                            }
                          </span>

                        </label>

                      )
                    )

                  )
                }

              </div>


              <div
                className={
                  styles.modalActions
                }
              >

                <button
                  type="button"
                  className={
                    styles.cancelButton
                  }
                  onClick={
                    closeModal
                  }
                  disabled={
                    isSaving ||
                    isCreatingCategory
                  }
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className={
                    styles.saveButton
                  }
                  onClick={
                    handleSaveSelection
                  }
                  disabled={
                    isSaving ||
                    isCreatingCategory
                  }
                >

                  {
                    isSaving
                      ? "Saving..."
                      : "Save"
                  }

                </button>

              </div>

            </div>

          </div>

        )
      }

    </div>

  );

};


export default AddSop;