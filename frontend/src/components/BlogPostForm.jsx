import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function BlogPostForm() {
  const initialState = {
    title: "",
    content: "",
    tags: [""],
  };

  const [blogForm, setBlogForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const backendLink = useSelector((state) => state.prodReducer.link);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      const tagsArray = value.split(",");
      console.log(tagsArray);

      setBlogForm((prev) => ({
        ...prev,
        [name]: tagsArray,
      }));
    } else {
      setBlogForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", blogForm.title);
      formData.append("content", blogForm.content);
      formData.append("tags", blogForm.tags);
      // console.log("form data", formData);

      const res = await axios.post(
        `${backendLink}/api/blog/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        },
        { timeout: 20000 }
      );
      // console.log(res);
      toast.success(res.data.message);
      navigate(`/blogs/${id}`);
      setBlogForm(initialState);
      setFile(null);
      document.getElementById("thumbnail").value = ""; // Reset file input
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-sm bg-white shadow-md p-3 sm:p-4 md:p-5 space-y-5 md:space-y-8"
    >
      {/* thumbnail */}
      <div className="flex gap-x-10 items-center">
        <label
          className="text-md sm:text-lg font-semibold text-[#6E8E59]"
          htmlFor="thumbnail"
        >
          Thumbnail:
        </label>
        <input
          className="transition duration-300 ease file:mr-4 file:rounded-full file:border-0 file:bg-[#6E8E59] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#780C28] dark:file:bg-violet-600 dark:file:text-violet-100 dark:hover:file:bg-violet-500"
          type="file"
          id="thumbnail"
          name="thumbnail"
          // value={file.name}
          onChange={(e) => setFile(e.target.files[0])}
          multiple={false}
        />
      </div>

      {/* title */}
      <div className="flex flex-col justify-center">
        <label
          className="text-md sm:text-lg font-semibold text-[#6E8E59]"
          htmlFor="title"
        >
          Title
        </label>
        <input
          className="border-b focus:border-transparent outline-black  px-2 py-1 my-1"
          type="text"
          id="title"
          name="title"
          value={blogForm.title}
          placeholder="Enter Your Title"
          onChange={handleInputChange}
        />
      </div>

      {/* content */}
      <div className="flex flex-col justify-center">
        <label
          className="text-md sm:text-lg font-semibold text-[#6E8E59]"
          htmlFor="content"
        >
          Content
        </label>
        <textarea
          className="border-b focus:border-transparent outline-black  px-2 py-1 my-1"
          type="textarea"
          id="content"
          name="content"
          value={blogForm.content}
          placeholder="Enter Your Content"
          onChange={handleInputChange}
          rows={5}
        />
        <caption className="text-xs text-left font-semibold bg-gray-300 w-fit px-1 cursor-default">
          Minimum 100 Character & Maximum 500 Character
        </caption>
      </div>

      {/* tags */}
      <div className="flex flex-col justify-center">
        <label
          className="text-md sm:text-lg font-semibold text-[#6E8E59]"
          htmlFor="tags"
        >
          Tags
        </label>
        <input
          className="border-b focus:border-transparent outline-black  px-2 py-1 my-1"
          type="text"
          id="tags"
          name="tags"
          value={blogForm.tags}
          placeholder="Enter Your Tags"
          onChange={handleInputChange}
        />
      </div>

      {/* submit button */}
      <div className="flex flex-col justify-center ">
        <button
          disabled={loading ? true : false}
          type="submit"
          className={`transition duration-150 ease-in-out text-sm md:text-md font-medium text-white bg-[#6E8E59] px-3 py-2 rounded-md ${
            loading ? "opacity-50" : "cursor-pointer hover:bg-[#780C28]"
          }`}
        >
          {loading ? "Submit..." : "Create Blog"}
        </button>
      </div>
    </form>
  );
}
