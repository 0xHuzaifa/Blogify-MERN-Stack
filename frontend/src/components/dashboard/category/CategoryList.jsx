import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategory,
  getAllCategories,
} from "../../../store/categorySlice.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function CategoryList() {
  const initialState = {
    id: "",
    name: "",
  };
  const [categoryDetail, setCategoryDetail] = useState(initialState);
  const [updateCategory, setUpdateCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const categoryPerPage = 5;
  const { categories, loading, error } = useSelector(
    (state) => state.categoryReducer
  );

  const dispatch = useDispatch();
  const fetchCategories = useCallback(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const indexOfLastCategory = currentPage * categoryPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoryPerPage;
  const currentCategory = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderedCategory = useMemo(() => {
    return (
      <table className="w-full border">
        <thead className="my-5">
          <tr className="text-xl font-bold">
            <td className="pl-3 border">S No</td>
            <td className="pl-3 border">Name</td>
            <td className="pl-3 border">Slug</td>
            <td className="pl-3 border">Actions</td>
          </tr>
        </thead>
        <tbody>
          {currentCategory.map((category, key) => {
            return (
              <tr id={category._id} key={key} className="border">
                <td className="border pl-5 py-2">{key + 1}</td>
                <td className="border pl-5">{category.name}</td>
                <td className="border pl-5 py-2">{category.slug}</td>
                <td className="border pl-5 py-2 space-x-5">
                  <button
                    onClick={() => {
                      setCategoryDetail({
                        id: category._id,
                        name: category.name,
                      });
                      setUpdateCategory(true);
                    }}
                    className="space-x-2 cursor-pointer transition duration-150 ease-out font-medium text-base bg-blue-500 text-white rounded hover:bg-blue-700 px-2 py-0.5"
                  >
                    <FontAwesomeIcon icon={faEdit} className="pr-1" />
                    Update
                  </button>

                  <button
                    onClick={() => {
                      setCategoryDetail({
                        id: category._id,
                        name: category.name,
                      });
                      setDeleteCategory(true);
                    }}
                    className="cursor-pointer transition duration-150 ease-out font-medium text-base bg-red-500 text-white rounded hover:bg-red-700 px-2 py-0.5"
                  >
                    <FontAwesomeIcon icon={faTrash} className="pr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }, [categories, currentCategory, currentPage, categoryPerPage]);

  return (
    <div className="w-full flex flex-col items-center px-5 sm:px-8 lg:px-12 ">
      {loading ? (
        <>
          <h5 className="text-md md:text-lg lg:text-2xl font-medium">
            Fetching Categories...
          </h5>
        </>
      ) : error ? (
        <h5 className="text-md md:text-lg lg:text-2xl font-medium text-red-500">
          Error fetching Categories.
        </h5>
      ) : categories.length ? (
        <>
          <div className="w-full min-h-[250px]">{renderedCategory}</div>

          <div className="flex justify-center mt-4">
            {Array.from(
              { length: Math.ceil(categories.length / categoryPerPage) },
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
        <h5 className="text-md md:text-lg lg:text-2xl font-medium">
          No Categories available.
        </h5>
      )}

      <UpdateCategory
        open={updateCategory}
        close={() => setUpdateCategory(false)}
        id={categoryDetail.id}
        title={categoryDetail.name}
      />

      <DeleteCategory
        open={deleteCategory}
        close={() => setDeleteCategory(false)}
        id={categoryDetail.id}
        title={categoryDetail.name}
      />
    </div>
  );
}

export const UpdateCategory = ({ open, close, id, title }) => {
  const navigate = useNavigate();
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
              navigate(`/dashboard/category-update/${id}`);
              close();
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

export const DeleteCategory = ({ open, close, id, title }) => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { loading: reduxLoading, error } = useSelector(
    (state) => state.categoryReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(reduxLoading);
    setLocalError(error);
  }, [reduxLoading, error]);

  const categoryDelete = async () => {
    console.log("categoryDelete");
    const result = await dispatch(deleteCategory(id));
    if (deleteCategory.fulfilled.match(result)) {
      close();
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
            onClick={categoryDelete}
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
