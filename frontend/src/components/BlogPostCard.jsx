import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function BlogPostCard({ blog }) {
  return (
    <>
      <div className="max-w-7xl rounded-lg p-5">
        <div className="bg-[#EAFAEA] text-[#6E8E59] flex flex-col sm:flex-row overflow-hidden">
          <img
            src={blog.thumbnail.url}
            className="w-50 rounded object-cover object-center"
            alt="title"
          />
          <div className="max-w-3xl flex flex-col justify-evenly p-3 sm:p-5 md:px-7">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              {blog.title.toUpperCase()}
            </h2>
            <hr className="max-w-[250px] my-2 " />
            <p className="my-3 mr-10 line-clamp-2">{blog.content}</p>

            <div className="flex flex-wrap justify-between items-center font-medium text-[14px]">
              <div className="flex space-x-4 sm:space-x-3 self-center font-medium text-">
                <h3>{blog.author.username.toUpperCase()}</h3>
                <p>{new Date(blog.createdAt).toLocaleDateString()} </p>
              </div>
              <button className="transition duration-300 ease-in-out px-3 py-0.5 rounded-md text-white bg-[#6E8E59] hover:bg-[#780C28]">
                <Link to={`/blogs/${blog._id}`}>Read More</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
