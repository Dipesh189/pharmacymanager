import { useState } from "react";

import image from "../../assets/makans ltd logo.png";

import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

import styles from "./Login.module.css";


type UserRole =
  | "admin"
  | "manager"
  | "staff"
  | "branch";


type LoginProps = {
  onLoginSuccess: (role: UserRole) => void;
};


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;


const Login = ({
  onLoginSuccess,
}: LoginProps) => {

  const [
    username,
    setUsername,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  // =========================
  // SUBMIT LOGIN
  // =========================

  const handleSubmit = async (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();


    setError("");

    setIsLoading(
      true
    );


    try {

      const response =
        await fetch(
          `${API_BASE_URL}/login/`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              username,
              password,
            }),
          }
        );


      const data =
        await response.json();


      // =========================
      // LOGIN FAILED
      // =========================

      if (!response.ok) {

        setError(
          data.detail ||
          "Invalid username or password."
        );

        return;

      }


      // =========================
      // GET ACCESS LEVEL
      // =========================

      const accessLevel =
        data.user
          ?.access_level
          ?.toLowerCase();


      const validRoles:
        UserRole[] = [
          "admin",
          "manager",
          "staff",
          "branch",
        ];


      // =========================
      // INVALID ACCESS LEVEL
      // =========================

      if (
        !accessLevel ||
        !validRoles.includes(
          accessLevel as UserRole
        )
      ) {

        setError(
          "Your account does not have a valid access level."
        );

        return;

      }


      // =========================
      // SAVE JWT TOKENS
      // =========================

      localStorage.setItem(
        "accessToken",
        data.access
      );


      localStorage.setItem(
        "refreshToken",
        data.refresh
      );


      // =========================
      // SAVE USER
      // =========================

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
      );


      // =========================
      // LOGIN SUCCESS
      // =========================

      onLoginSuccess(
        accessLevel as UserRole
      );


    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      setError(
        "Unable to connect to the server."
      );


    } finally {

      setIsLoading(
        false
      );

    }

  };


  return (
    <>

      {/* =========================
          LOADING SCREEN
         ========================= */}

      {
        isLoading && (
          <LoadingScreen />
        )
      }


      {/* =========================
          LOGIN PAGE
         ========================= */}

      <main
        className={
          styles.loginPage
        }
      >

        {/* TOP WAVE */}

        <div
          className={`
            ${styles.loginWave}
            ${styles.loginWaveTop}
          `}
        />


        {/* BOTTOM WAVE */}

        <div
          className={`
            ${styles.loginWave}
            ${styles.loginWaveBottom}
          `}
        />


        {/* =========================
            LOGIN CARD
           ========================= */}

        <section
          className={
            styles.loginCard
          }
        >

          {/* =========================
              BRAND
             ========================= */}

          <div
            className={
              styles.loginBrand
            }
          >

            <div
              className={
                styles.loginLogo
              }
            >

              <img
                src={
                  image
                }
                alt="Makans Ltd Logo"
              />

            </div>


            <h1>
              Makans Ltd
            </h1>


            <p>
              Sign in to access your dashboard
            </p>

          </div>


          {/* =========================
              LOGIN FORM
             ========================= */}

          <form
            className={
              styles.loginForm
            }
            onSubmit={
              handleSubmit
            }
          >

            {/* =========================
                USERNAME
               ========================= */}

            <div
              className={
                styles.formGroup
              }
            >

              <label
                htmlFor="username"
              >
                Username
              </label>


              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"

                value={
                  username
                }

                onChange={
                  (event) =>
                    setUsername(
                      event.target.value
                    )
                }

                autoComplete="username"

                disabled={
                  isLoading
                }

                required
              />

            </div>


            {/* =========================
                PASSWORD
               ========================= */}

            <div
              className={
                styles.formGroup
              }
            >

              <label
                htmlFor="password"
              >
                Password
              </label>


              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"

                value={
                  password
                }

                onChange={
                  (event) =>
                    setPassword(
                      event.target.value
                    )
                }

                autoComplete="current-password"

                disabled={
                  isLoading
                }

                required
              />

            </div>


            {/* =========================
                ERROR
               ========================= */}

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


            {/* =========================
                LOGIN OPTIONS
               ========================= */}

            <div
              className={
                styles.loginOptions
              }
            >

              <label
                className={
                  styles.rememberMe
                }
              >

                <input
                  type="checkbox"
                  disabled={
                    isLoading
                  }
                />

                <span>
                  Remember me
                </span>

              </label>


              <a
                href="/forgot-password"
                className={
                  styles.forgotPassword
                }
              >
                Forgot password?
              </a>

            </div>


            {/* =========================
                LOGIN BUTTON
               ========================= */}

            <button
              type="submit"
              className={
                styles.loginButton
              }
              disabled={
                isLoading
              }
            >

              {
                isLoading
                  ? "Signing in..."
                  : "Login"
              }

            </button>

          </form>


          {/* =========================
              FOOTER
             ========================= */}

          <p
            className={
              styles.loginFooter
            }
          >
            © {
              new Date()
                .getFullYear()
            } Makans Ltd
          </p>

        </section>

      </main>

    </>
  );

};


export default Login;