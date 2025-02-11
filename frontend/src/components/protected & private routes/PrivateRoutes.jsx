import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoutes() {
  const isAdmin = useSelector((state) => state.authReducer.isAdmin);
  console.log("private routing: ", isAdmin);

  return isAdmin ? <Outlet /> : <Navigate to={"/"} />;
}
