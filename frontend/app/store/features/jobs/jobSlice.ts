import { configureStore, createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { jobApplicationApi } from "@/lib/jobapi";
import  {RootState}  from "@/store/store";
import { IPersonalInfo, IEducation, IExperience } from "@/types/jobTypes";

// Define FormState interface
export interface FormState {
  currentStep: number;
  personalInfo: IPersonalInfo;
  educations: IEducation[];
  experiences: IExperience[];
  formSubmitted: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: FormState = {
  currentStep: 1,
  personalInfo: {
    jobType: "" as IPersonalInfo["jobType"],
    feeDepositDate: new Date(),
    feeAmount: "" as IPersonalInfo["feeAmount"],
    cnic: "",
    applicantName: "",
    fatherName: "",
    age: 0,
    dateOfBirth: new Date(),
    domicile: "" as IPersonalInfo["domicile"],
    gender: "" as IPersonalInfo["gender"],
    religion: "" as IPersonalInfo["religion"],
    possessRequiredQualification: false,
    transcriptIssuanceDate: new Date(),
    isInGovernmentService: false,
    verificationNumber: "",
  },
  educations: [],
  experiences: [],
  formSubmitted: false,
  loading: false,
  error: null,
};

// Async thunk to submit form in sequence
export  const submitFormData = createAsyncThunk(
  "form/submitFormData",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() ;
    const { personalInfo, educations, experiences } = state.form;

    try {
      // Step 1: Submit personal info
      const personalResponse = await jobApplicationApi.createPersonalInfo(personalInfo);
      const applicationId = personalResponse.id; // Assuming response contains application ID

      // Step 2: Submit education details
      for (const edu of educations) {
        await jobApplicationApi.addEducation(applicationId, edu);
      }

      // Step 3: Submit experience details
      for (const exp of experiences) {
        await jobApplicationApi.addExperience(applicationId, exp);
      }

      // Step 4: Final submission
      await jobApplicationApi.submitApplication(applicationId);

      return "Success";
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Submission failed");
    }
  }
);


export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setPersonalInfo: (state, action: PayloadAction<IPersonalInfo>) => {
      state.personalInfo = action.payload;
    },
    addEducation: (state, action: PayloadAction<IEducation>) => {
      state.educations.push(action.payload);
    },
    updateEducation: (state, action: PayloadAction<IEducation>) => {
      const index = state.educations.findIndex((edu) => edu.id === action.payload.id);
      if (index !== -1) {
        state.educations[index] = action.payload;
      }
    },
    removeEducation: (state, action: PayloadAction<string>) => {
      state.educations = state.educations.filter((edu) => edu.id !== action.payload);
    },
    addExperience: (state, action: PayloadAction<IExperience>) => {
      state.experiences.push(action.payload);
    },
    updateExperience: (state, action: PayloadAction<IExperience>) => {
      const index = state.experiences.findIndex((exp) => exp.id === action.payload.id);
      if (index !== -1) {
        state.experiences[index] = action.payload;
      }
    },
    removeExperience: (state, action: PayloadAction<string>) => {
      state.experiences = state.experiences.filter((exp) => exp.id !== action.payload);
    },
    resetForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFormData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFormData.fulfilled, (state) => {
        state.loading = false;
        state.formSubmitted = true;
      })
      .addCase(submitFormData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});




export const {
  setCurrentStep,
  setPersonalInfo,
  addEducation,
  updateEducation,
  removeEducation,
  addExperience,
  updateExperience,
  removeExperience,
  resetForm,
} = formSlice.actions;

export  const store = configureStore({
  reducer: {
    form: formSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;