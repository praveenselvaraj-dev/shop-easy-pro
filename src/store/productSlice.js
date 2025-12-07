import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productApi } from "../api/productApi";

export const fetchProducts = createAsyncThunk(
  "product/fetch",
  async ({ search, sortBy, sortOrder, page, size }, { rejectWithValue }) => {
    try {
      const res = await productApi.list({ search, sort_by: sortBy, sort_order: sortOrder, page, size });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk("product/get", async (id, { rejectWithValue }) => {
  try {
    const res = await productApi.get(id);
    return res.data;
  } catch (err) {
    return rejectWithValue("Product fetch failed");
  }
});

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, thunkAPI) => {
    try {
      const res = await axios.post(API, productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${API}/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue }) => {
    try {
      await productApi.remove(id);
      return id; 
    } catch (err) {
      return rejectWithValue("Product delete failed");
    }
  }
);

export const fetchLowStock = createAsyncThunk(
  "admin/lowStock",
  async (threshold, { rejectWithValue }) => {
    try {
      const res = await productApi.lowStock(threshold);
      return res.data;
    } catch (err) {
      return rejectWithValue("Low stock failed");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    total: 0,
    loading: false,
    error: null,
    selected: null,
  },
  reducers: {
  },
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, (s) => { s.loading = true; })
     .addCase(fetchProducts.fulfilled, (s, a) => {
       s.loading = false;
       s.products = a.payload.products || [];
       s.total = a.payload.total || 0;
     })
     .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

     .addCase(fetchProductById.pending, (s) => { s.loading = true; })
     .addCase(fetchProductById.fulfilled, (s, a) => { s.loading = false; s.selected = a.payload; })
     .addCase(fetchProductById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.products = state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLowStock.fulfilled, (s, a) => {
        s.lowStock = Array.isArray(a.payload) ? a.payload : a.payload.items || [];
      });
  },
});

export default productSlice.reducer;
