const API_URL = "http://127.0.0.1:8000/data_makans";


export interface LoginUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  access_level: "Admin" | "Manager" | "Staff" | "Branch";
  branch_name: string | null;
  ods_code: string | null;
}


export interface LoginResponse {
  access: string;
  refresh: string;
  user: LoginUser;
}


export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {

  const response = await fetch(
    `${API_URL}/login/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        password,
      }),
    }
  );


  const data = await response.json();


  if (!response.ok) {
    throw new Error(
      data.detail || "Invalid username or password"
    );
  }


  return data;
};