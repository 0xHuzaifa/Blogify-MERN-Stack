import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";

// const dispatch = useDispatch();
// get all comment
const getAllComments = createAsyncThunk(
  "getAllComments",
  async (postId, { getState, rejectWithValue }) => {
    const state = getState();
    const backendLink = state.prodReducer.link;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${backendLink}/api/comment/get/${postId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      // toast.success(res.data.message);
      return res.data.comments;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

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
    addComment: (state, action) => {
      state.commentsData.unshift(action.payload);
    },
    addCommentReply: (state, action) => {
      const reply = action.payload;
      const index = state.commentsData.findIndex(
        (comment) => comment._id === reply.parentComment
      );
      if (index !== -1) {
        state.commentsData[index].replies = [
          ...state.commentsData[index]?.replies,
          reply,
        ];
      }
    },
    deleteCommentReply: (state, action) => {
      const deletedReply = action.payload;
      const index = state.commentsData.findIndex(
        (comment) => comment._id === deletedReply.parentComment
      );
      if (index !== -1) {
        state.commentsData = state.commentsData[index].replies.filter(
          (comment) => comment._id !== deletedReply._id
        );
      }
    },
  },
  extraReducers: (builder) => {
    // get all comments case
    builder.addCase(getAllComments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllComments.fulfilled, (state, action) => {
      state.loading = false;
      state.commentsData = action.payload;
    });
    builder.addCase(getAllComments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // delete comment case
    builder.addCase(deleteComment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.loading = false;
      const id = action.payload._id;
      if (
        action.payload.parentComment !== null ||
        action.payload.parentComment !== ""
      ) {
        state.commentsData = state.commentsData.filter(
          (comment) => comment._id !== id
        );
      }
    });
    builder.addCase(deleteComment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // update comment case
    builder.addCase(updateComment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateComment.fulfilled, (state, action) => {
      const updateComment = action.payload.comment;
      if (
        updateComment.parentComment === null ||
        updateComment.parentComment === ""
      ) {
        const index = state.commentsData.findIndex(
          (comment) => comment._id === updateComment._id
        );
        if (index !== -1) {
          state.commentsData[index] = updateComment;
        }
      }
      state.loading = false;
    });
    builder.addCase(updateComment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default commentSlice.reducer;
export const {
  storeComments,
  addComment,
  addCommentReply,
  deleteCommentReply,
} = commentSlice.actions;
export { deleteComment, updateComment, getAllComments };
