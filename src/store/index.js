import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import favoritesReducer from "./slices/favoritesSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    favorites: favoritesReducer,
  },
});

export * from "./thunks/userThunks";
export { userLogout, openModel } from "./slices/userSlice";
