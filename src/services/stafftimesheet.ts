const API_URL = "http://127.0.0.1:8000/data_makans";


export const apiFetch = async (
  url: string,
  options: RequestInit = {}
) => {

  let accessToken =
    localStorage.getItem("accessToken");


  let response = await fetch(
    `${API_URL}${url}`,
    {
      ...options,

      headers: {
        ...options.headers,

        "Content-Type": "application/json",

        Authorization:
          `Bearer ${accessToken}`,
      },
    }
  );


  // Access token expired / invalid
  if (response.status === 401) {

    const refreshToken =
      localStorage.getItem("refreshToken");


    if (!refreshToken) {

      localStorage.clear();

      window.location.href = "/login";

      return response;
    }


    // Try to get a new access token
    const refreshResponse =
      await fetch(
        `${API_URL}/makans_token/refresh/`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            refresh: refreshToken,
          }),
        }
      );


    if (!refreshResponse.ok) {

      localStorage.clear();

      window.location.href = "/login";

      return response;
    }


    const refreshData =
      await refreshResponse.json();


    // Save new access token
    localStorage.setItem(
      "accessToken",
      refreshData.access
    );


    accessToken =
      refreshData.access;


    // Repeat original request
    response = await fetch(
      `${API_URL}${url}`,
      {
        ...options,

        headers: {
          ...options.headers,

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${accessToken}`,
        },
      }
    );

  }


  return response;
};