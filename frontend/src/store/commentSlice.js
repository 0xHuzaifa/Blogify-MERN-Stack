import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// delete comment
const deleteComment = createAsyncThunk(
  "deleteComment",
  async (commentId, { getState, rejectWithValue }) => {
    const state = getState();
    const backendLink = state.prodReducer.link;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(`${backendLink}/api/comment/delete`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: { commentId },
      });
      toast.success(res.data.message);
      return res.data.comment;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// update comment
const updateComment = createAsyncThunk(
  "updateComment",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const backendLink = state.prodReducer.link;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch(`${backendLink}/api/comment/update`, data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  commentsData: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    storeComments: (state, action) => {
      state.commentsData = action.payload;
    },
    addComment: (state, action) => {
      state.commentsData.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    // delete category case
    builder.addCase(deleteComment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.loading = false;
      const id = action.payload._id;
      state.commentsData = state.commentsData.filter(
        (category) => category._id !== id
      );
    });
    builder.addCase(deleteComment.rejected, (state, action) => {
      state.loading = false;
      console.log("slice error", action.payload);
      state.error = action.payload;
    });

    // update category case
    builder.addCase(updateComment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateComment.fulfilled, (state, action) => {
      state.loading = false;
      const updateComment = action.payload.comment;
      const index = state.commentsData.findIndex(
        (comment) => comment._id === updateComment._id
      );
      if (index !== -1) {
        state.commentsData[index] = updateComment;
      }
    });
    builder.addCase(updateComment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default commentSlice.reducer;
export const { storeComments, addComment } = commentSlice.actions;
export { deleteComment, updateComment };
