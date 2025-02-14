import React, { useEffect } from "react";
import SideBar from "../components/SideBar";
// import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { dashboardVisit } from "../store/authSlice";

export default function Dashboard() {
  const location = useLocation();
  console.log("location", location);

  const pathSegments = location.pathname.split("/");
  console.log("path segment", pathSegments);
  const activeComponent =
    pathSegments.length === 4
      ? pathSegments[pathSegments.length - 2] || "Dashboard"
      : pathSegments[pathSegments.length - 1] || "Dashboard";
  console.log("active component", activeComponent);

  const backendLink = useSelector((state) => state.prodReducer.link);
  const { isAdmin, isDashboardVisited } = useSelector(
    (state) => state.authReducer
  );
  console.log("dashboard", isAdmin);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const componentTitles = {
    profile: "Profile",
    "blogs-list": "Blog List",
    "create-blog": "Create Blog",
    "update-blog": "Update Blog",
  };

  const fetch = async () => {
    try {
      if (!isDashboardVisited) {
        dispatch(dashboardVisit());
        const token = localStorage.getItem("token");

        if (token && isAdmin) {
          const res = await axios.get(`${backendLink}/api/admin/dashboard`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
          console.log("dashboard response", res);
          toast.success(res.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };

  useEffect(() => {
    // console.log("111");

    fetch();
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] bg-[#EAFAEA] flex relative overflow-hidden">
      <SideBar />

      <main className="flex-1 overflow-y-auto">
        <div className="h-auto p-5">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 text-[#780C28]">
            {componentTitles[activeComponent] || "Profile"}
          </h1>

          <div className="flex justify-center my-5 md:my-10 lg:my-15 px-5 md:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
