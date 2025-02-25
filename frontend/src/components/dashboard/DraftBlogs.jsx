import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function DraftBlogs() {
  const initialState = {
    id: "",
    title: "",
    author: "",
  };
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [blogDetail, setBlogDetail] = useState(initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const backendLink = useSelector((state) => state.prodReducer.link);
  const blogsPerPage = 5;

  const handleDelete = (id) => {
    setBlogs(blogs.filter((blog) => blog._id !== id));
  };

  useEffect(() => {
    const fetch = async () => {
      console.log("blogs", blogs);

      if (blogs.length === 0) {
        setLoading(true);
        try {
          setLoading(true);
          const res = await axios.get(`${backendLink}/api/blog/get/draft`);
          // const resResult = JSON.stringify(res.data.posts);
          // console.log("response", JSON.stringify(res.data.posts));
          console.log(res);
          setBlogs(res.data.posts);
        } catch (error) {
          console.log("catch error", error);
          toast.error(error.response.data.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetch();
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlog = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  // console.log("index of last blog", indexOfLastBlog);
  // console.log("index of first blog", indexOfFirstBlog);
  // console.log("current blog list", currentBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full flex flex-col items-center">
      {loading ? (
        <>
          <h5 className="text-md md:text-lg lg:text-2xl font-medium">
            Fetching Blogs...
          </h5>
        </>
      ) : (
        <>
          {blogs && blogs?.length > 0 ? (
            <>
              <div className="w-full min-h-[250px]">
                <table className="w-full border">
                  <thead className="my-5">
                    <tr className="text-xl font-bold">
                      <td className="pl-3 border">Title</td>
                      <td className="pl-3 border">Author</td>
                      <td className="pl-3 border">Category</td>
                      <td className="pl-3 border">Publish Date</td>
                      <td className="pl-3 border">Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBlog.map((blog, key) => {
                      return (
                        <tr id={blog._id} key={key} className="border">
                          <td className="border pl-5 py-2">{blog.title}</td>
                          <td className="border pl-5">
                            {blog.author.username}
                          </td>
                          <td className="border pl-5">{blog.category.name}</td>
                          <td className="border pl-5 py-2">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </td>
                          <td className="border pl-5 py-2 space-x-5">
                            <button
                              onClick={() => {
                                setUpdateOpen(true);
                                setBlogDetail({
                                  id: blog._id,
                                  title: blog.title,
                                  author: blog.author.username,
                                });
                              }}
                              className="space-x-2 cursor-pointer transition duration-150 ease-out font-medium text-base bg-blue-500 text-white rounded hover:bg-blue-700 px-2 py-0.5"
                            >
                              <FontAwesomeIcon icon={faEdit} className="pr-1" />
                              Update
                            </button>

                            <button
                              onClick={() => {
                                setDeleteOpen(true);
                                setBlogDetail({
                                  id: blog._id,
                                  title: blog.title,
                                });
                              }}
                              className="cursor-pointer transition duration-150 ease-out font-medium text-base bg-red-500 text-white rounded hover:bg-red-700 px-2 py-0.5"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="pr-1"
                              />
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

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
                No Blogs Found!
              </h5>
            </>
          )}
        </>
      )}

      <UpdatePost
        open={updateOpen}
        close={() => {
          setUpdateOpen(false);
          setBlogDetail(initialState);
        }}
        id={blogDetail.id}
        title={blogDetail.title}
        author={blogDetail.author}
      />
      <DeletePost
        open={deleteOpen}
        close={() => {
          setDeleteOpen(false);
          setBlogDetail(initialState);
        }}
        id={blogDetail.id}
        title={blogDetail.title}
        onDelete={handleDelete}
      />
    </div>
  );
}

export const UpdatePost = ({ open, close, id, title, author }) => {
  console.log("update post id", id);
  const navigate = useNavigate();

  const handleUpdate = async () => {
    console.log("author", author);
    const token = localStorage.getItem("token");
    try {
      const decode = jwtDecode(token);
      console.log("jwt decode", decode.username);
      if (author !== decode.username) {
        throw new Error("unauthorized");
      } else {
        console.log("true");
        navigate(`/dashboard/update-blog/${id}`);
        close();
      }
    } catch (error) {
      toast.error("You are not author of this post");
      console.log(error);
    }
  };

  return (
    <div
      onClick={close}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-black/20" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col justify-evenly items-center p-5 space-y-5 bg-white "
      >
        <span
          onClick={close}
          className="absolute top-2 right-2 border rounded-sm px-1 cursor-pointer"
        >
          <FontAwesomeIcon icon={faXmark} />
        </span>
        <h4 className="mt-5 font-semibold text-md md:text-xl lg:text-2xl">
          Do you want to update {title}?
        </h4>
        <div className="space-x-5">
          <button
            onClick={close}
            className="cursor-pointer transition duration-150 ease-out font-medium text-sm md:text-base bg-gray-500 text-white rounded hover:bg-gray-700 px-2 py-0.5"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              handleUpdate();
            }}
            className="cursor-pointer transition duration-150 ease-out font-medium text-sm md:text-base bg-blue-500 text-white rounded hover:bg-blue-700 px-2 py-0.5"
          >
            <FontAwesomeIcon icon={faEdit} className="pr-1" />
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export const DeletePost = ({ open, close, id, title, onDelete }) => {
  const backendLink = useSelector((state) => state.prodReducer.link);
  const [loading, setLoading] = useState(false);

  const deleteBlog = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${backendLink}/api/blog/delete/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      // console.log(res);
      toast.success(res.data.message);
      onDelete(id);
      close();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={close}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-black/20" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col justify-evenly items-center p-5 space-y-5 bg-white "
      >
        <span
          onClick={close}
          className="absolute top-2 right-2 border rounded-sm px-1 cursor-pointer"
        >
          <FontAwesomeIcon icon={faXmark} />
        </span>
        <h4 className="mt-5 font-semibold text-md md:text-xl lg:text-2xl">
          Do you want to Delete {title}?
        </h4>
        <div className="space-x-5">
          <button
            onClick={close}
            className="cursor-pointer transition duration-150 ease-out font-medium text-sm md:text-base bg-gray-500 text-white rounded hover:bg-gray-700 px-2 py-0.5"
          >
            Cancel
          </button>

          <button
            onClick={deleteBlog}
            disabled={loading ? true : false}
            className={`transition duration-150 ease-out font-medium text-sm md:text-base bg-red-500 text-white rounded hover:bg-red-700 px-2 py-0.5 ${
              loading ? "bg-red-700 opacity-50" : "cursor-pointer"
            }`}
          >
            <FontAwesomeIcon icon={faEdit} className="pr-1" />
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
