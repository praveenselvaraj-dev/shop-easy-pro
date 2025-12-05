import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "../api/adminApi";

export const fetchAnalytics = createAsyncThunk(
  "admin/analytics",
  async ({ from, to }, { rejectWithValue }) => {
    try {
      const res = await adminApi.analytics(from, to);
      return res.data;
    } catch (err) {
      return rejectWithValue("Analytics failed");
    }
  }
);

export const fetchLowStock = createAsyncThunk(
  "admin/lowStock",
  async (threshold, { rejectWithValue }) => {
    try {
      const res = await adminApi.lowStock(threshold);
      return res.data;
    } catch (err) {
      return rejectWithValue("Low stock failed");
    }
  }
);


const adminSlice = createSlice({
  name: "admin",
  initialState: { analytics: null, lowStock: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchAnalytics.pending, (s) => { s.loading = true; })
     .addCase(fetchAnalytics.fulfilled, (s, a) => { s.loading = false; s.analytics = a.payload; })
     .addCase(fetchAnalytics.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

     .addCase(fetchLowStock.fulfilled, (s, a) => {
  s.lowStock = Array.isArray(a.payload) ? a.payload : a.payload.items || [];
});

  },
});

export default adminSlice.reducer;
