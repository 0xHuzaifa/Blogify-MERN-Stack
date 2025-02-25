import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateCategory } from "../../../store/categorySlice";
import axios from "axios";
import { toast } from "react-toastify";

export default function CategoryUpdate() {
  const initialState = {
    name: "",
    slug: "",
  };

  const [categoryForm, setCategoryForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  // const backendLink = useSelector((state) => state.prodReducer.link);
  const { loading: reduxLoading, error } = useSelector(
    (state) => state.categoryReducer
  );
  const backendLink = useSelector((state) => state.prodReducer.link);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${backendLink}/api/category/get/${id}`);
        const name = res.data.category.name;
        const slug = res.data.category.slug;
        console.log("name", name);
        console.log("slug", slug);
        setCategoryForm({ name, slug });
      } catch (error) {
        console.log(error.response);
        toast.error(error.response.data.message);
        navigate("/dashboard/category-list");
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    setLoading(reduxLoading);
    setLocalError(error);
  }, [reduxLoading, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("111");
    console.log("category form", categoryForm);
    const result = await dispatch(updateCategory({ id, data: categoryForm }));
    console.log("result", result);
    try {
      if (updateCategory.fulfilled.match(result)) {
        setLoading(reduxLoading);
        setLocalError(error);
        setCategoryForm(initialState);
        navigate("/dashboard/category-list");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-[#6E8E59]">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={categoryForm?.name}
            onChange={handleInputChange}
            placeholder="Enter Category Name"
            className="w-full border-b border-input bg-background hover:bg-accent/50 focus-visible:ring-1"
          />
        </div>

        {/* Slug Field */}
        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium text-[#6E8E59]">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            value={categoryForm?.slug}
            onChange={handleInputChange}
            placeholder="Enter-Your-Slug"
            className="w-full border-b border-input bg-background hover:bg-accent/50 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#6E8E59] hover:bg-[#780C28] rounded-sm text-white font-medium transition-colors px-2 py-0.5"
        >
          {loading ? "Submitting..." : "Update Category"}
        </button>
      </div>
    </form>
  );
}
