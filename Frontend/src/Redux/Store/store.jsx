// store.jsx
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userReducer from "../Slicers/AuthSlice";
import profileReducer from "../Slicers/userSlice";
import eventsReducer from "../Slicers/EventSlice";
import googleAuthReducer from "../Slicers/GoogleAuthSlice";
import orderReducer from "../Slicers/orderSlice";
import organizerReducer from "../Slicers/OrganizzerSlice";
import paymentReducer from "../Slicers/PaymentSlice";
import ticketReducer from "../Slicers/ticketSlice";
import adminReducer from "../Slicers/adminSlice";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "events", "googleAuth"],
};

// Root reducer
const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  events: eventsReducer,
  googleAuth: googleAuthReducer,
  orders: orderReducer,
  organizer: organizerReducer,
  payments: paymentReducer,
  tickets: ticketReducer,
  admin: adminReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Fix non-serializable warning by ignoring redux-persist actions
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
