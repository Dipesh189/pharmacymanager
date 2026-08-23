import {
  Navigate,
} from "react-router-dom";

import type {
  ReactNode,
} from "react";

import {
  useAuth,
} from "../../../context/AuthContext";


interface Props {
  children: ReactNode;
}


const ProtectedRoute = ({
  children,
}: Props) => {

  const {
    accessToken,
  } = useAuth();


  if (!accessToken) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return children;
};


export default ProtectedRoute;