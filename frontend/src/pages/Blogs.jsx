import React, { useEffect, useState } from "react";
import BlogPostCard from "../components/BlogPostCard";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const backendLink = useSelector((state) => state.prodReducer.link);
  const blogsPerPage = 5;

  useEffect(() => {
    setLoading(true);

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendLink}/api/blog/get`);
        // const resResult = JSON.stringify(res.data.posts);
        // console.log("response", JSON.stringify(res.data.posts));
        setBlogs(res.data.posts);
      } catch (error) {
        console.log("catch error", error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlog = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full flex flex-col items-center my-5 md:my-10">
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
              {currentBlog.map((blog, key) => {
                return <BlogPostCard key={key} blog={blog} />;
              })}

              <div className="flex justify-center mt-4">
                {Array.from(
                  { length: Math.ceil(blogs.length / blogsPerPage) },
                  (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`mx-1 px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </>
          ) : (
            <>
              <h5 className="text-md md:text-lg lg:text-2xl font-medium">
                Unable to find any blogs
              </h5>
            </>
          )}
        </>
      )}
    </div>
  );
}
