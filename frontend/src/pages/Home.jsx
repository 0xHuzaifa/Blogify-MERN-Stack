import React, { useCallback, useEffect, useMemo, useState } from "react";
import BlogPostCard from "../components/BlogPostCard";
import HeroSection from "../components/HeroSection";
// import HeroSection from "../components/HeroSection";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../store/blogSlice.js";

export default function Home() {
  const [currentBlog, setCurrentBlog] = useState([]);
  const { blogs, loading, error } = useSelector((state) => state.blogReducer);
  const dispatch = useDispatch();

  const fetchBlogs = useCallback(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    setCurrentBlog(blogs.slice(0, 4));
  }, [blogs]);

  const renderedBlogs = useMemo(() => {
    return currentBlog.map((blog, key) => (
      <BlogPostCard key={blog._id || key} blog={blog} />
    ));
  }, [currentBlog]);

  return (
    <div>
      <HeroSection />
      <div className="w-full flex flex-col items-center px-5 sm:px-8 lg:px-12 my-5 md:my-10">
        <h2 className="text-xl md:text-3xl lg:text-5xl text-[#6E8E59] font-bold self-start mb-5">
          Latest Blogs
        </h2>
        {loading ? (
          <>
            <h5 className="text-md md:text-lg lg:text-2xl font-medium">
              Fetching Blogs...
            </h5>
          </>
        ) : error ? (
          <h5 className="text-md md:text-lg lg:text-2xl font-medium text-red-500">
            Error fetching blogs.
          </h5>
        ) : blogs.length ? (
          renderedBlogs
        ) : (
          <h5 className="text-md md:text-lg lg:text-2xl font-medium">
            No blogs available.
          </h5>
        )}
      </div>
    </div>
  );
}
