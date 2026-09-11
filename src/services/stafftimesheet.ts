const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;


export const apiFetch = async (
  url: string,
  options: RequestInit = {}
) => {

  let accessToken =
    localStorage.getItem(
      "accessToken"
    );

  const refreshToken =
    localStorage.getItem(
      "refreshToken"
    );


  const makeRequest = async (
    token: string | null
  ) => {

    const headers =
      new Headers(
        options.headers
      );


    // =========================
    // JWT
    // =========================

    if (token) {

      headers.set(
        "Authorization",
        `Bearer ${token}`
      );

    }


    // =========================
    // CONTENT TYPE
    // =========================

    const isFormData =
      options.body instanceof FormData;


    // Normal JSON body
    if (
      options.body &&
      !isFormData
    ) {

      headers.set(
        "Content-Type",
        "application/json"
      );

    }


    // File upload
    // Browser automatically sets
    // multipart/form-data boundary
    if (isFormData) {

      headers.delete(
        "Content-Type"
      );

    }


    // =========================
    // REQUEST
    // =========================

    return fetch(
      `${API_BASE_URL}${url}`,
      {
        ...options,
        headers,
      }
    );

  };


  // =========================
  // FIRST REQUEST
  // =========================

  let response =
    await makeRequest(
      accessToken
    );


  // =========================
  // ACCESS TOKEN EXPIRED
  // =========================

  if (
    response.status === 401 &&
    refreshToken
  ) {

    const refreshResponse =
      await fetch(
        `${API_BASE_URL}/makans_token/refresh/`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            refresh:
              refreshToken,
          }),
        }
      );


    // =========================
    // REFRESH SUCCESS
    // =========================

    if (
      refreshResponse.ok
    ) {

      const refreshData =
        await refreshResponse.json();


      accessToken =
        refreshData.access;


      localStorage.setItem(
        "accessToken",
        refreshData.access
      );


      // Retry original request
      response =
        await makeRequest(
          accessToken
        );

    } else {

      // =========================
      // REFRESH FAILED
      // =========================

      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "refreshToken"
      );

      localStorage.removeItem(
        "user"
      );


      window.location.href =
        "/login";

    }

  }


  return response;

};