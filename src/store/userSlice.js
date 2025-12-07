import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

export const loginUser = createAsyncThunk("user/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.login(payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Login failed");
  }
});

export const registerUser = createAsyncThunk("user/register", async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.register(payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Register failed");
  }
});

export const loadProfile = createAsyncThunk("user/profile", async (_, { rejectWithValue }) => {
  try {
    const res = await authApi.profile();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Profile load failed");
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => { 
        s.loading = true; 
        s.error = null; 
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user || null;

        if (s.user) {
          localStorage.setItem("user", JSON.stringify(s.user));
        }

        if (a.payload.access_token) {
          s.token = a.payload.access_token;
          localStorage.setItem("token", a.payload.access_token);
        }
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.loading = false; 
        s.error = a.payload; 
      })
      .addCase(registerUser.pending, (s) => { s.loading = true; })
      .addCase(registerUser.fulfilled, (s) => { s.loading = false; })
      .addCase(registerUser.rejected, (state, action) => {
        const apiError = action.payload?.detail || action.payload?.message || "Registration failed";
        state.error = apiError;
        state.loading = false;
      })
      .addCase(loadProfile.fulfilled, (s, a) => { 
        s.user = a.payload; 
        localStorage.setItem("user", JSON.stringify(a.payload));
      });
  },
});

export const { logout, setToken } = userSlice.actions;
export default userSlice.reducer;
