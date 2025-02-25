import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// get all categories
const getAllCategories = createAsyncThunk(
  "getCategories",
  async (_, { getState }) => {
    const state = getState();
    const backendLink = state.prodReducer.link;
    const { categories } = state.categoryReducer;
    try {
      if (categories.length > 0) return categories;
      const res = await axios.get(`${backendLink}/api/category/get`);
      toast(res.data.message);
      // console.log(res.data.categories);
      return res.data.categories;
    } catch (error) {
      toast(error.response.data.message);
      throw error;
    }
  }
);

// create categories
const createCategories = createAsyncThunk(
  "createCategories",
  async (data, { getState }) => {
    const state = getState();
    const backendLink = state.prodReducer.link;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`${backendLink}/api/category/create`, data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message);
      return res.data.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error.response.data.message;
    }
  }
);

// delete category
const deleteCategory = createAsyncThunk(
  "deleteCategory",
  async (id, { getState }) => {
    const state = getState();
    const backendLink = state.prodReducer.link;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(
        `${backendLink}/api/category/delete/${id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error.response.data);
      throw error;
    }
  }
);

// update category
const updateCategory = createAsyncThunk(
  "updateCategory",
  async ({ id, data }, { getState }) => {
    console.log("id", id);
    console.log("data", data);
    const state = getState();
    const backendLink = state.prodReducer.link;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${backendLink}/api/category/update/${id}`,
        data,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      return res.data.category;
    } catch (error) {
      console.log(error.response.data);
      throw error;
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    // get all categories case
    builder.addCase(getAllCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    });
    builder.addCase(getAllCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // create new category case
    builder.addCase(createCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories.push(action.payload);
    });
    builder.addCase(createCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // delete category case
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.loading = false;
      const id = action.payload.category._id;
      state.categories = state.categories.filter(
        (category) => category._id !== id
      );
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // update category case
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.loading = false;
      const updateCategory = action.payload;
      const index = state.categories.findIndex(
        (category) => category._id === updateCategory._id
      );
      if (index !== -1) {
        state.categories[index] = updateCategory;
      }
    });
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default categorySlice.reducer;

export { getAllCategories, deleteCategory, createCategories, updateCategory };
