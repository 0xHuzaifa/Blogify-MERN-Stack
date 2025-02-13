import React, { useEffect, useState } from "react";
import BlogPostCard from "../components/BlogPostCard";
import HeroSection from "../components/HeroSection";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Home() {
  const [blogs, setBlogs] = useState();
  const [loading, setLoading] = useState(false);
  const backendLink = useSelector((state) => state.prodReducer.link);

  useEffect(() => {
    setLoading(true);

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendLink}/api/blog/get`);
        // const resResult = JSON.stringify(res.data.posts);
        // console.log("response", JSON.stringify(res.data.posts));
        setBlogs(res.data.posts.slice(0, 4));
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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
        ) : (
          <>
            {blogs ? (
              <>
                {blogs.map((blog, key) => {
                  return <BlogPostCard key={key} blog={blog} />;
                })}
              </>
            ) : (
              <h5 className="text-md md:text-lg lg:text-2xl font-medium">
                Unable to find any blogs
              </h5>
            )}
          </>
        )}
      </div>
    </div>
  );
}
