import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
  // console.log("protected route: ", isLoggedIn);

  return isLoggedIn ? <Outlet /> : <Navigate to={"/login"} />;
}
