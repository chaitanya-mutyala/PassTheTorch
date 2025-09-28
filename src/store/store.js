import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";  // 👈 import your reducer

const store = configureStore({
  reducer: {
    auth: authReducer,   // 👈 register it here
  },
});

export default store;
