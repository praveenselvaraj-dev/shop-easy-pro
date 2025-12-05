import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileApi } from "../api/profileApi";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await profileApi.get();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (data, { getState, rejectWithValue }) => {
    try {
      const id = getState().profile.profile.id;
      const res = await profileApi.update(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update profile");
    }
  }
);

export const deleteProfile = createAsyncThunk(
  "profile/deleteProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const id = getState().profile.profile.id;
      await profileApi.remove(id);
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    deleted: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload; 
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.loading = false;
        state.deleted = true;
        state.profile = null;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
