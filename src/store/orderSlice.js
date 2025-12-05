import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderApi } from "../api/orderApi";

export const checkout = createAsyncThunk("order/checkout", async (payload, { rejectWithValue }) => {
  try {
    const res = await orderApi.checkout(payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Checkout failed");
  }
});

export const fetchMyOrders = createAsyncThunk(
  "order/myOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await orderApi.myOrders();
      return res.data || [];
    } catch (err) {
      return rejectWithValue("Failed to load orders");
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "order/details",
  async (id, { rejectWithValue }) => {
    try {
      const res = await orderApi.getOrder(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch details");
    }
  }
);



const orderSlice = createSlice({
  name: "order",
  initialState: { orders: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(checkout.pending, (s) => { s.loading = true; })
     .addCase(checkout.fulfilled, (s, a) => { s.loading = false; s.orders.unshift(a.payload); })
     .addCase(checkout.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

     .addCase(fetchMyOrders.pending, (s) => { s.loading = true; })
     .addCase(fetchMyOrders.fulfilled, (s, a) => { s.loading = false; s.orders = a.payload; })
     .addCase(fetchMyOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchOrderDetails.pending, (s) => { s.loading = true; })
     .addCase(fetchOrderDetails.fulfilled, (s, a) => {
       s.loading = false;
       s.orderDetails = a.payload;
     })
     .addCase(fetchOrderDetails.rejected, (s, a) => {
       s.loading = false;
       s.error = a.payload;
     });
  },
});

export default orderSlice.reducer;
