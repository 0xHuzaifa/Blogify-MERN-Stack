import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllCategories } from "../../store/categorySlice";

export default function BlogUpdateForm() {
  const initialState = {
    title: "",
    content: "",
    tags: [""],
    publish: false,
    category: "",
  };

  const [blogForm, setBlogForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const backendLink = useSelector((state) => state.prodReducer.link);
  const { categories } = useSelector((state) => state.categoryReducer);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchCategories = useCallback(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fetch = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await axios.get(`${backendLink}/api/blog/get/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data.post);
        setBlogForm({
          title: res.data.post.title,
          content: res.data.post.content,
          tags: res.data.post.tags,
          publish: res.data.post.publish,
          category: res.data.post.category.name,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogForm((prev) => ({
      ...prev,
      [name]: name === "publish" ? value === "true" : value,
    }));
    console.log(blogForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      if (file) {
        formData.append("image", file);
      }
      formData.append("title", blogForm.title);
      formData.append("content", blogForm.content);
      formData.append("tags", blogForm.tags);
      formData.append("publish", blogForm.publish);
      formData.append("category", blogForm.category);

      // console.log("form data", formData);

      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${backendLink}/api/blog//update/${id}`,
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

      {/* category && publish */}
      <div className="flex gap-x-10">
        {/* category */}
        <div className="flex gap-x-5 items-center">
          <label
            className="text-md sm:text-lg font-semibold text-[#6E8E59]"
            htmlFor="thumbnail"
          >
            Category:
          </label>
          <select
            name="category"
            id=""
            className="border px-2 w-40 pb-0.5"
            onChange={handleInputChange}
            value={blogForm.category}
          >
            <option>--</option>
            {categories?.map((category, key) => {
              return (
                <option key={key} value={category.category}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* publish */}
        <div className="w-full md:max-w-[80%] flex gap-x-5 relative">
          <label
            className="text-md md:text-lg text-[#6E8E59] font-bold"
            htmlFor="publish"
          >
            Display:
          </label>
          <div className="flex gap-x-3">
            <input
              type="radio"
              id="publish"
              name="publish"
              value="true"
              onChange={handleInputChange}
              checked={blogForm.publish === true}
              required
            />
            <label
              className="text-md md:text-lg text-[#6E8E59] font-bold"
              htmlFor="gender"
            >
              Public
            </label>
            <input
              type="radio"
              id="female"
              name="publish"
              value="false"
              onChange={handleInputChange}
              checked={blogForm.publish === false}
              required
            />
            <label
              className="text-md md:text-lg text-[#6E8E59] font-bold"
              htmlFor="gender"
            >
              Draft
            </label>
          </div>
        </div>
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
          {loading ? "Submit..." : "Update Blog"}
        </button>
      </div>
    </form>
  );
}
