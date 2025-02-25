import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCategories } from "../../../store/categorySlice";
export default function CategoryAdd() {
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setLoading(reduxLoading);
    setLocalError(error);
  }, [reduxLoading, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createCategories(categoryForm));
    if (createCategories.fulfilled.match(result)) {
      setLoading(reduxLoading);
      setLocalError(error);
      navigate("/dashboard/category-list");
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
            value={categoryForm.name}
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
            value={categoryForm.slug}
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
          {loading ? "Submitting..." : "Add Category"}
        </button>
      </div>
    </form>
  );
}
