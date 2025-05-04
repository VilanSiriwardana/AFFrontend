import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser } from "../thunks/userThunks";

const initialState = {
  currentUser: null,
  updateUser: null,
  openedModalName: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogout: (state) => {
      state.currentUser = null;
      state.updateUser = null;
      state.openedModalName = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    openModel: (state, action) => {
      state.openedModalName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.fulfilled, (state, action) => {
        const { accessToken, user } = action.payload;
        localStorage.setItem("accessToken", accessToken);
        state.currentUser = user;
      })

      // Login User
      .addCase(loginUser.fulfilled, (state, action) => {
        const { accessToken, user } = action.payload;
        localStorage.setItem("accessToken", accessToken);
        state.currentUser = user;
      });
  },
});

export const { userLogout, openModel } = userSlice.actions;
export default userSlice.reducer;
