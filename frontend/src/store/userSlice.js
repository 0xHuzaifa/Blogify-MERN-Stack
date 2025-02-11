import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProfile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    resetUserProfile: (state) => {
      state.userProfile = null;
    },
  },
});

export const { setUserProfile, resetUserProfile } = userSlice.actions;

export default userSlice.reducer;

/*
Usage:

// To store the user profile
dispatch(setUserProfile(userProfileObject));

// To get the user profile
const userProfile = useSelector(selectUserProfile);

// To reset the user profile
dispatch(resetUserProfile());
*/
