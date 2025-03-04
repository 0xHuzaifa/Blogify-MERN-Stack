import { configureStore } from "@reduxjs/toolkit";
import productionReducer from "./productionSlice";
import authReducer from "./authSlice.js";
import userReducer from "./userSlice.js";
import categoryReducer from "./categorySlice.js";
import blogReducer from "./blogSlice.js";
import commentReducer from "./commentSlice.js";

const store = configureStore({
  reducer: {
    prodReducer: productionReducer,
    authReducer: authReducer,
    userReducer: userReducer,
    categoryReducer: categoryReducer,
    blogReducer: blogReducer,
    commentReducer: commentReducer,
  },
});

export default store;
