import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "loginSlice",
  initialState: {
    isLoggedIn: false,
    isAdmin: false,
    isDashboardVisited: false,
  },

  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },

    admin: (state) => {
      state.isAdmin = true;
    },

    dashboardVisit: (state) => {
      state.isDashboardVisited = true;
    },

    logout: (state) => {
      (state.isDashboardVisited = false),
        (state.isAdmin = false),
        (state.isLoggedIn = false);
    },
  },
});

export const { login, logout, admin, dashboardVisit } = authSlice.actions;
export default authSlice.reducer;
