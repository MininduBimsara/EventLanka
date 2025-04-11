import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Slicers/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
