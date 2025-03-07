import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import formReducer from './features/jobs/jobSlice'; // Import the formSlice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>; // Fix the RootState type
export type AppDispatch = typeof store.dispatch;
