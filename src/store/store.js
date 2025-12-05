import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import adminReducer from "./adminSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import profileReducer from "./profileSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    profile: profileReducer,
  },
});

export default store;
