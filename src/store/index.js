import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice"; // You already have this

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});

export * from "./thunks/userThunks";
export { userLogout, openModel } from "./slices/userSlice";
