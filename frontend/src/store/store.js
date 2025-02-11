import { configureStore } from "@reduxjs/toolkit";
import productionReducer from "./productionSlice";
import authReducer from "./authSlice.js";
import userReducer from "./userSlice.js";

export const store = configureStore({
  reducer: {
    prodReducer: productionReducer,
    authReducer: authReducer,
    userReducer: userReducer,
  },
});
