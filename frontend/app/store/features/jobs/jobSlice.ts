import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store"; // Assuming you have a store file
import axios from "axios";

// Define the initial state
interface FormState {
  personalDetails: Record<string, any>;
  educationalDetails: Record<string, any>;
  experience: Record<string, any>;
  loading: boolean;
  error: string | null;
}

const initialState: FormState = {
  personalDetails: {},
  educationalDetails: {},
  experience: {},
  loading: false,
  error: null,
};

// Async thunk for submitting data in order
export const submitFormData = createAsyncThunk(
  "form/submitFormData",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { personalDetails, educationalDetails, experience } = state.form;
    const { token } = state.auth;

    try {
      // API request with authentication token
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post("/personaldetails", personalDetails, config);
      await axios.post("/educationaldetails", educationalDetails, config);
      await axios.post("/experience", experience, config);

      return "Success";
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Submission failed");
    }
  }
);

const formSlice = createSlice({
  name: "jobform",
  initialState,
  reducers: {
    updatePersonalDetails: (
      state,
      action: PayloadAction<Record<string, any>>
    ) => {
      state.personalDetails = action.payload;
    },
    updateEducationalDetails: (
      state,
      action: PayloadAction<Record<string, any>>
    ) => {
      state.educationalDetails = action.payload;
    },
    updateExperience: (state, action: PayloadAction<Record<string, any>>) => {
      state.experience = action.payload;
    },

    resetForm: (state) => {
      state.personalDetails = {};
      state.educationalDetails = {};
      state.experience = {};
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(submitFormData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFormData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitFormData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updatePersonalDetails,
  updateEducationalDetails,
  updateExperience,
} = formSlice.actions;
export default formSlice.reducer;
