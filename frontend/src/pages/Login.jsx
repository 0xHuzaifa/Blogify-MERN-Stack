import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { admin, login } from "../store/authSlice";
import { setUserProfile } from "../store/userSlice";

export default function Login() {
  const initialState = {
    email: "",
    password: "",
  };

  const [loginData, setLoginData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const backendLink = useSelector((state) => state.prodReducer.link);
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${backendLink}/api/auth/login`, loginData);
      // console.log(res);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
      }

      const token = localStorage.getItem("token");

      const profile = await axios.get(`${backendLink}/api/auth/profile`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (profile.status === 200) {
        // console.log("Login response", res);
        console.log("profile response", profile);
        console.log("profile user data", profile.data.user);

        if (profile.data.user.role === "admin") {
          // console.log("admin role:-", profile.data.user.role);
          localStorage.setItem("admin", true);
          dispatch(login());
          dispatch(admin());
          localStorage.setItem("profile", JSON.stringify(profile.data.user));
          dispatch(setUserProfile(profile.data.user));
        } else if (profile.data.user.role === "user") {
          // console.log("user role:-", profile.data.user.role);

          dispatch(login());
        }
      }
      toast.success(res.data.message);
      setLoginData(initialState);
    } catch (error) {
      // console.log(error.message);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[calc(100dvh-64px)] box-border bg-[#EAFAEA] flex justify-center items-center p-5 ">
      <div className="w-full sm:w-[70dvh] bg-white p-5 m-5 shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="h-full border border-[#780C28] rounded px-3 md:px-2 py-5 flex flex-col justify-evenly items-center gap-5 md:gap-7"
        >
          {/* Heading */}
          <div className="w-full md:max-w-[80%]">
            <h2 className="text-xl sm:text-2xl md:text-3xl md:text-center text-[#780C28] font-bold">
              Login Page
            </h2>
          </div>
          {/* email */}
          <div className="w-full md:max-w-[80%] flex flex-col gap-y-1">
            <label
              className="text-md md:text-lg text-[#6E8E59] font-bold"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="text-base md:text-md border-b focus:border-b-2 border-[#780C28] outline-none px-2 py-1"
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email"
              onChange={handleInput}
              value={loginData.email}
              required
            />
          </div>
          {/* password */}
          <div className="w-full md:max-w-[80%] flex flex-col gap-y-1 relative">
            <label
              className="text-md md:text-lg text-[#6E8E59] font-bold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="border-b focus:border-b-2 border-[#780C28] outline-none px-2 py-1"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter Your Password"
              value={loginData.password}
              onChange={handleInput}
              required
            />
            {showPassword ? (
              <FontAwesomeIcon
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 bottom-2 text-xl opacity-50 cursor-pointer"
                icon={faEye}
              />
            ) : (
              <FontAwesomeIcon
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1.5 bottom-2 text-xl opacity-50 cursor-pointer"
                icon={faEyeSlash}
              />
            )}
          </div>
          {/* button */}
          <div className="w-full md:max-w-[80%]">
            <button
              disabled={loading ? true : false}
              type="submit"
              className={`transition duration-300 ease-in-out cursor-pointer px-3 py-0.5 pb-1 rounded-md text-white bg-[#6E8E59] ${
                loading ? "opacity-50" : "hover:bg-[#780C28]"
              }`}
            >
              {/* <Link to={"/dashboard"}>Login</Link> */}
              {loading ? "Submit..." : "Login"}
            </button>
          </div>

          {/* register */}
          <div className="w-full md:max-w-[80%] flex flex-col sm:flex-row justify-between items-center gap-3 text-center">
            <h4 className="text-base sm:text-sm md:text-md text-[#6E8E59] font-medium">
              Don't have an account?
            </h4>
            <button className="transition duration-300 ease-in-out text-base sm:text-sm md:text-md text-[#780C28] font-medium hover:text-white hover:bg-[#780C28] px-3 py-0.5 pb-1 rounded-md">
              <Link to={"/registration"}>Create One</Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
