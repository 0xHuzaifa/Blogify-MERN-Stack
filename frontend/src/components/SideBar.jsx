import React, { useState } from "react";
import sidebar from "../assets/sidebar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBlog,
  faPenToSquare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { toast } from "react-toastify";
import { resetUserProfile } from "../store/userSlice";

export default function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    let token = localStorage.getItem("token");
    // let admin = localStorage.getItem("admin");
    // let profile = localStorage.getItem("profile");
    // console.log(token);

    if (token) {
      localStorage.removeItem("token");
      // localStorage.removeItem("admin");
      // localStorage.removeItem("profile");
      dispatch(logout());
      // dispatch(resetUserProfile());
      navigate("/login");
      toast.success("Logout Successfully");
    }
  };

  return (
    <aside
      className={`relative flex-shrink-0 h-[calc(100vh-64px)] flex flex-col bg-[#CAE0BC] transition-all duration-300 ease-in-out ${
        isSidebarOpen ? `w-64` : `w-16`
      }`}
    >
      <div className="flex flex-col gap-y-10">
        <h2
          className={`cursor-default p-5 text-xl md:text-2xl font-bold text-[#780C28] transition-opacity ease-in-out ${
            isSidebarOpen ? `opacity-100 duration-300 delay-200` : `opacity-0`
          }`}
        >
          Dashboard
        </h2>
        <ul
          className={`cursor-pointer text-md md:text-lg font-medium text-[#780C28] transition-opacity ease-in-out ${
            isSidebarOpen ? `opacity-100 duration-300 delay-200` : `opacity-0`
          }`}
        >
          <Link to={"/dashboard/profile"}>
            <li className="px-3 py-1 transition-all duration-300 hover:bg-[#EAFAEA]">
              <FontAwesomeIcon className="pr-2 pl-3" icon={faUser} />
              Profile
            </li>
          </Link>

          <Link to={"/dashboard/blogs-list"}>
            <li className="px-3 py-1 my-3 transition-all duration-300 hover:bg-[#EAFAEA]">
              <FontAwesomeIcon className="pr-2 pl-3" icon={faBlog} />
              Blogs List
            </li>
          </Link>

          <Link to={"/dashboard/create-blog"}>
            <li className="px-3 py-1 transition-all duration-300 hover:bg-[#EAFAEA]">
              <FontAwesomeIcon className="pr-2 pl-3" icon={faPenToSquare} />
              Create Blog
            </li>
          </Link>
        </ul>

        <button
          onClick={handleLogout}
          className={`transition-opacity ease-in-out cursor-pointer px-3 py-0.5 pb-1 text-white bg-[#6E8E59] hover:bg-[#780C28] ${
            isSidebarOpen ? `opacity-100 duration-300 delay-200` : `opacity-0`
          }`}
        >
          Logout
        </button>
      </div>

      <div className="pl-3 absolute bottom-4">
        <img
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`w-10 h-10 cursor-pointer transition-transform duration-300 ${
            isSidebarOpen ? "" : "rotate-180"
          }`}
          src={sidebar}
          alt="sidebarIcon"
        />
      </div>
    </aside>
  );
}
