import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Register() {
  const initialState = {
    username: "",
    email: "",
    password: "",
    phone: 0,
    gender: "",
    dob: "",
  };

  const [RegisterData, setRegisterData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const backendLink = useSelector((state) => state.prodReducer.link);

  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(
        `${backendLink}/api/auth/register`,
        RegisterData
      );

      console.log(res);

      if (res.status === 201) {
        toast.success(res.data.message);
        navigate("/login");
      }
      setRegisterData(initialState);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[calc(100%+64px)] box-border bg-[#EAFAEA] flex justify-center items-center">
      <div className="w-[70dvw] md:w-[65dvh]  bg-white p-5 my-10 shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="h-full border border-[#780C28] rounded px-3 md:px-2 py-5 flex flex-col justify-evenly items-center gap-5 md:gap-7"
        >
          {/* Heading */}
          <div className="w-full md:max-w-[80%]">
            <h2 className="text-xl sm:text-2xl md:text-3xl md:text-center text-[#780C28] font-bold">
              Registration Page
            </h2>
          </div>

          {/* username */}
          <div className="w-full md:max-w-[80%] flex flex-col gap-y-1">
            <label
              className="text-md md:text-lg text-[#6E8E59] font-bold"
              htmlFor="email"
            >
              User Name
            </label>
            <input
              className="text-base md:text-md border-b focus:border-b-2 border-[#780C28] outline-none px-2 py-1"
              type="text"
              id="username"
              name="username"
              placeholder="Enter Your Unique User Name"
              onChange={handleInput}
              value={RegisterData.username}
              required
            />
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
              value={RegisterData.email}
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
              value={RegisterData.password}
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
                className="absolute right-2 bottom-2 text-xl opacity-50 cursor-pointer"
                icon={faEyeSlash}
              />
            )}
          </div>

          {/* phone number */}
          <div className="w-full md:max-w-[80%] flex flex-col gap-y-1 relative">
            <label
              className="text-md md:text-lg text-[#6E8E59] font-bold"
              htmlFor="phoneNo"
            >
              Phone No
            </label>
            <input
              className="border-b focus:border-b-2 border-[#780C28] outline-none px-2 py-1"
              type="number"
              id="phoneNo"
              name="phone"
              placeholder="Enter Your Phone Number"
              value={RegisterData.phone}
              onChange={handleInput}
              required
            />
          </div>

          {/* gender */}
          <div className="w-full md:max-w-[80%] flex flex-col gap-y-1 relative">
            <label
              className="text-md md:text-lg text-[#6E8E59] font-bold"
              htmlFor="gender"
            >
              Gender
            </label>
            <div className="flex gap-x-3">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                onChange={handleInput}
                required
              />
              <label
                className="text-md md:text-lg text-[#6E8E59] font-bold"
                htmlFor="gender"
              >
                Male
              </label>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                onChange={handleInput}
                required
              />
              <label
                className="text-md md:text-lg text-[#6E8E59] font-bold"
                htmlFor="gender"
              >
                Female
              </label>
            </div>
          </div>

          {/* date of birth */}
          <div className="w-full md:max-w-[80%] flex flex-col gap-y-1 relative">
            <label
              className="text-md md:text-lg text-[#6E8E59] font-bold"
              htmlFor="password"
            >
              Date Of Birth
            </label>
            <input
              className="border-b focus:border-b-2 border-[#780C28] outline-none px-2 py-1"
              type="date"
              id="dob"
              name="dob"
              value={RegisterData.dob}
              onChange={handleInput}
              required
            />
          </div>

          {/* button */}
          <div className="w-full md:max-w-[80%]">
            <button
              disabled={loading ? true : false}
              type="submit"
              className={`transition duration-300 ease-in-out px-3 py-0.5 pb-1 rounded-md text-white bg-[#6E8E59] ${
                loading ? "opacity-50" : "hover:bg-[#780C28]"
              }`}
            >
              {loading ? "Submit..." : "Register"}
            </button>
          </div>

          {/* go to login page */}
          <div className="w-full md:max-w-[80%] flex flex-col sm:flex-row justify-between items-center gap-3 text-center">
            <h4 className="text-base sm:text-sm md:text-md text-[#6E8E59] font-medium">
              Already have an account?
            </h4>
            <button className="transition duration-300 ease-in-out text-base sm:text-sm md:text-md text-[#780C28] font-medium hover:text-white hover:bg-[#780C28] px-3 py-0.5 pb-1 rounded-md">
              <Link to={"/login"}>Login</Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
