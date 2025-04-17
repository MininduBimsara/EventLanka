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
import profileReducer from "../Slicers/userSlice"; // Assuming this is the correct path
import eventsReducer from "../Slicers/EventSlice";


// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "events"],
};

// Root reducer
const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer, //userSlice
  events: eventsReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Fix non-serializable warning by ignoring redux-persist actions
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
