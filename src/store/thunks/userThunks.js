import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../configs/api";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data) => {
    const response = await api.post("/register", data);
    return response.data;
  }
);

export const loginUser = createAsyncThunk("auth/loginUser", async (data) => {
  const response = await api.post("/login", data);
  return response.data;
});
