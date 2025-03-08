import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAllBlogs = createAsyncThunk("getBlogs", async (_, { getState }) => {
  const state = getState();
  const backendLink = state.prodReducer.link;
  const { blogs } = state.blogReducer;

  try {
    if (blogs.length > 0) {
      return blogs;
    }
    const res = await axios.get(`${backendLink}/api/blog/get`);
    return res.data.posts;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

const initialState = {
  blogs: [],
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blogging",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getAllBlogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllBlogs.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = action.payload;
    });
    builder.addCase(getAllBlogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default blogSlice.reducer;
export { getAllBlogs };
