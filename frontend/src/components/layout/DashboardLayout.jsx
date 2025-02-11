import React, { useEffect } from "react";
import SideBar from "../SideBar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <SideBar />

      <Outlet />
    </div>
  );
}
