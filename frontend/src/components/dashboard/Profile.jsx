import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../../store/userSlice";
import axios from "axios";

export default function Profile() {
  const [profile, setProfile] = useState();

  const backendLink = useSelector((state) => state.prodReducer.link);
  // let profile = useSelector((state) => state.userReducer.userProfile);
  // setProfile(userProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetch = async () => {
      const profile = await axios.get(`${backendLink}/api/auth/profile`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      // console.log(profile.data.user);
      setProfile(profile.data.user);
    };

    fetch();

    // console.log("Login response", res);
    // console.log("profile response", profile);
    // console.log("profile user data", profile.data.user);

    // console.log("111");
    // if (isProfile && !profile) {
    //   console.log("222");
    //   const parsedProfile = JSON.parse(isProfile);
    //   dispatch(setUserProfile(parsedProfile));
    //   profile = parsedProfile;
    //   // setProfile(userProfile);
    // }
  }, []);

  // console.log("isProfile", isProfile);

  return (
    <div className="max-w-[1100px] w-[70dvw]  bg-white p-5 my-5 shadow-2xl">
      <form className="h-full border border-[#780C28] rounded px-3 md:px-2 py-5 flex flex-col justify-evenly items-center gap-5 md:gap-7">
        {/* Heading */}
        <div className="w-full md:max-w-[80%]">
          <h2 className="text-xl sm:text-2xl md:text-3xl md:text-center text-[#780C28] font-bold">
            Profile Detail
          </h2>
        </div>

        {/* username */}
        <div className="w-full md:max-w-[80%] flex flex-col custom:flex-row justify-between items-center gap-y-1">
          <label
            className="text-md md:text-lg text-[#6E8E59] font-bold "
            htmlFor="email"
          >
            User Name :
          </label>
          <input
            className="w-[100px] sm:w-auto text-base md:text-md border-b focus:border-b-2 border-[#780C28] outline-none px-2 py-1 bg-gray-200"
            type="text"
            id="username"
            name="username"
            placeholder="Enter Your Unique User Name"
            value={profile ? profile.username : ""}
            disabled={true}
          />
        </div>

        {/* email */}
        <div className="w-full md:max-w-[80%] flex flex-col custom:flex-row justify-between items-center gap-y-1">
          <label
            className="text-md md:text-lg text-[#6E8E59] font-bold "
            htmlFor="email"
          >
            Email :
          </label>
          <input
            className="w-[100px] sm:w-auto text-base md:text-md border-b focus:border-b-2 border-[#780C28] outline-none px-2 py-1 bg-gray-200"
            type="email"
            id="email"
            name="email"
            placeholder="Enter Your Email"
            value={profile ? profile.email : ""}
            disabled={true}
          />
        </div>

        {/* phone number */}
        <div className="w-full md:max-w-[80%] flex flex-col custom:flex-row justify-between items-center gap-y-1 relative">
          <label
            className="text-md md:text-lg text-[#6E8E59] font-bold"
            htmlFor="phoneNo"
          >
            Phone No
          </label>
          <input
            className="w-[100px] sm:w-auto border-b focus:border-b-2 border-[#780C28] outline-none px-2 py-1 bg-gray-200"
            type="number"
            id="phoneNo"
            name="phone"
            placeholder="Enter Your Phone Number"
            value={profile ? profile.phone : ""}
            disabled={true}
          />
        </div>

        {/* gender */}
        {/* <div className="w-full md:max-w-[80%] flex flex-col custom:flex-row custom:justify-between custom:items-center gap-y-2 relative">
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
              // value={profile.gender}
              disabled={true}
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
              // value={profile.gender}
              disabled={true}
            />
            <label
              className="text-md md:text-lg text-[#6E8E59] font-bold"
              htmlFor="gender"
            >
              Female
            </label>
          </div>
        </div> */}

        {/* date of birth */}
        {/* <div className="w-full md:max-w-[80%] flex flex-col custom:flex-row justify-between items-center gap-y-1 relative">
          <label
            className="text-md md:text-lg text-[#6E8E59] font-bold"
            htmlFor="password"
          >
            Date Of Birth
          </label>
          <input
            className="w-[100px] sm:w-auto border-b focus:border-b-2 border-[#780C28] outline-none px-2 py-1 bg-gray-200"
            type="date"
            id="dob"
            name="dob"
            // value={profile ? new Date(profile.dob).toLocaleDateString() : ""}
            disabled={true}
          />
        </div> */}
      </form>
    </div>
  );
}
