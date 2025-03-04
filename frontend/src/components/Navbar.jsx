import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { toast } from "react-toastify";

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
  const isAdmin = useSelector((state) => state.authReducer.isAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    let token = localStorage.getItem("token");
    if (token) {
      token = localStorage.removeItem("token");
      dispatch(logout());
      navigate("/login");
      toast.success("Logout Successfully");
    }
  };

  return (
    <header className="bg-[#EAFAEA] shadow-md relative z-10">
      <nav className="w-full sm:max-w-[550px] md:max-w-[750px] lg:max-w-[970px] xl:max-w-[1170px] mx-auto flex items-center justify-between px-[15px] h-16">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-[#6E8E59] text-2xl font-bold">
            <Link to={"/"}>Blogify</Link>
          </h1>
        </div>

        {/* Primary Nav Links */}
        <div className="hidden md:flex space-x-5">
          <ul className="flex space-x-5 text-[#6E8E59] font-medium text-md/8">
            <li className="hover:text-[#780C28] hover:bg-[#CAE0BC] px-2 py-2 rounded-md transition duration-150 ease">
              <Link to={"/"}>Home</Link>
            </li>
            <li className="hover:text-[#780C28] hover:bg-[#CAE0BC] px-2 py-2 rounded-md transition duration-150 ease">
              <Link to={"/blogs"}>Blogs</Link>
            </li>
            <li className="hover:text-[#780C28] hover:bg-[#CAE0BC] px-2 py-2 rounded-md transition duration-150 ease">
              <Link to={"/about"}>About</Link>
            </li>
          </ul>
        </div>

        {/* Secondary Links Buttons */}
        <div className="hidden md:flex space-x-3 font-medium text-md cursor-pointer">
          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <>
                  <button className="transition duration-300 ease-in-out cursor-pointer px-3 py-0.5 pb-1 rounded-md text-white bg-[#6E8E59] hover:bg-[#780C28]">
                    <Link to={"dashboard"}>DashBoard</Link>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogout}
                    className="transition duration-300 ease-in-out cursor-pointer px-3 py-0.5 pb-1 rounded-md text-white bg-[#6E8E59] hover:bg-[#780C28]"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button className="transition duration-300 ease px-3 py-0.5 pb-1 rounded-md text-[#6E8E59] hover:outline hover:outline-[#780C28] hover:text-[#780C28]">
                <Link to={"/login"}>Login</Link>
              </button>
              <button className="transition duration-300 ease px-3 py-0.5 pb-1 rounded-md text-white bg-[#6E8E59] hover:bg-[#780C28]">
                <Link to={"/registration"}>Signup</Link>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden border-2 border-[#6E8E59] px-2 rounded">
          <button
            className="cursor-pointer text-xl text-[#6E8E59] transition-all duration-300"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {" "}
            {isMobileOpen ? (
              <FontAwesomeIcon icon={faXmark} />
            ) : (
              <FontAwesomeIcon icon={faBars} />
            )}{" "}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${
            isMobileOpen
              ? "absolute top-[102%] left-0 bg-[#EAFAEA] w-full p-3 cursor-pointer"
              : "hidden"
          }`}
        >
          {/* Mobile Primary Links */}
          <div>
            <ul className="flex flex-col space-y-2 text-[#6E8E59] font-medium text-md/8">
              <li
                onClick={() => setIsMobileOpen(false)}
                className="hover:text-[#780C28] hover:bg-[#CAE0BC] px-2 py-2 rounded-md transition duration-150 ease-in-out"
              >
                <Link to={"/"}>Home</Link>
              </li>
              <li
                onClick={() => setIsMobileOpen(false)}
                className="hover:text-[#780C28] hover:bg-[#CAE0BC] px-2 py-2 rounded-md transition duration-150 ease-in-out"
              >
                <Link to={"/blogs"}>Blogs</Link>
              </li>
              <li
                onClick={() => setIsMobileOpen(false)}
                className="hover:text-[#780C28] hover:bg-[#CAE0BC] px-2 py-2 rounded-md transition duration-150 ease-in-out"
              >
                <Link to={"/about"}>About</Link>
              </li>
            </ul>
          </div>

          <hr className="max-w-[90%] my-2" />

          {/* Mobile Secondary Links */}
          <div className="flex space-x-2 font-medium pt-2 cursor-pointer">
            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => setIsMobileOpen(false)}
                      className="transition duration-300 ease-in-out cursor-pointer px-3 py-0.5 pb-1 rounded-md text-white bg-[#6E8E59] hover:bg-[#780C28]"
                    >
                      <Link to={"dashboard"}>DashBoard</Link>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileOpen(false);
                      }}
                      className="transition duration-300 ease-in-out cursor-pointer px-3 py-0.5 pb-1 rounded-md text-white bg-[#6E8E59] hover:bg-[#780C28]"
                    >
                      Logout
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="transition duration-300 ease px-3 py-0.5 pb-1 rounded-md text-[#6E8E59] hover:outline hover:outline-[#780C28] hover:text-[#780C28]"
                >
                  <Link to={"/login"}>Login</Link>
                </button>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="transition duration-300 ease px-3 py-0.5 pb-1 rounded-md text-white bg-[#6E8E59] hover:bg-[#780C28]"
                >
                  <Link to={"/registration"}>Signup</Link>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
