import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-64px)] bg-[#EAFAEA]">
      <h1 className="text-5xl text-[#6E8E59] font-bold">404</h1>
      <h2 className="text-2xl text-[#6E8E59]">Page Not Found</h2>
      <p className="text-xl text-[#6E8E59]">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        className="text-xl transition duration-100 ease font-medium text-white bg-[#6E8E59] hover:bg-[#780C28] border px-2 pb-0.5 my-2 rounded"
        to="/"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
