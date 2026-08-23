import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type {
  LoginUser,
} from "../src/services/authService";


interface AuthContextType {
  user: LoginUser | null;
  accessToken: string | null;
  login: (
    access: string,
    refresh: string,
    user: LoginUser
  ) => void;
  logout: () => void;
}


const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );


export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [user, setUser] =
    useState<LoginUser | null>(() => {

      const savedUser =
        localStorage.getItem("user");

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);
    });


  const [accessToken, setAccessToken] =
    useState<string | null>(() =>
      localStorage.getItem("accessToken")
    );


  const login = (
    access: string,
    refresh: string,
    userData: LoginUser
  ) => {

    localStorage.setItem(
      "accessToken",
      access
    );

    localStorage.setItem(
      "refreshToken",
      refresh
    );

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );


    setAccessToken(access);
    setUser(userData);
  };


  const logout = () => {

    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    localStorage.removeItem(
      "user"
    );


    setAccessToken(null);
    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};