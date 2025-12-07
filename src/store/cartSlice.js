import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi } from "../api/cartApi";

export const loadCart = createAsyncThunk("cart/load", async (_, { rejectWithValue }) => {
  try {
    const res = await cartApi.getCart();
    return res.data.items || [];
  } catch (err) {
    return rejectWithValue("Cart load failed");
  }
});

export const addToCart = createAsyncThunk("cart/add", async ({ productId, qty }, { rejectWithValue }) => {
  try {
    await cartApi.addToCart(productId, qty);
    const res = await cartApi.getCart();
    return res.data.items || [];
  } catch (err) {
    return rejectWithValue("Add to cart failed");
  }
});

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ itemId, qty }, { rejectWithValue }) => {
    try {
      await cartApi.updateQty(itemId, qty);
      const res = await cartApi.getCart();
      return res.data.items || [];
    } catch (err) {
      return rejectWithValue("Update cart failed");
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/remove",
  async (itemId, { rejectWithValue }) => {
    try {
      await cartApi.remove(itemId);
      const res = await cartApi.getCart();
      return res.data.items || [];
    } catch (err) {
      return rejectWithValue("Remove failed");
    }
  }
);

export const removeCart = createAsyncThunk(
  "cart/removeAll",
  async (_, { rejectWithValue }) => {
    try {
      await cartApi.removefullcart();
      return [];
    } catch (err) {
      return rejectWithValue("Remove all cart failed");
    }
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(loadCart.pending, (s) => { s.loading = true; })
     .addCase(loadCart.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
     .addCase(loadCart.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

//      .addCase(addToCart.fulfilled, (s, a) => {
//   s.items = a.payload;
//   alert("Added to cart!");
// })

     .addCase(updateCartItem.fulfilled, (s, a) => { s.items = a.payload; })
     .addCase(removeCartItem.fulfilled, (s, a) => { s.items = a.payload; });
  },
});

export default cartSlice.reducer;
