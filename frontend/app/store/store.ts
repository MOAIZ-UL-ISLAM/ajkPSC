import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import {formSlice} from './features/jobs/jobSlice'; 




export const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formSlice.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>; 
