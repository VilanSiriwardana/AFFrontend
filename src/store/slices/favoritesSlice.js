import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {}, // Store as { userId: [countries] }

  reducers: {
    addFavorite: (state, action) => {
      const { userId, country } = action.payload;
      if (!state[userId]) state[userId] = [];

      const exists = state[userId].find((c) => c.cca3 === country.cca3);
      if (!exists) state[userId].push(country);
    },

    removeFavorite: (state, action) => {
      const { userId, cca3 } = action.payload;
      if (state[userId]) {
        state[userId] = state[userId].filter((c) => c.cca3 !== cca3);
      }
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
