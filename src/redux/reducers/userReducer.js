import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";

const INITIAL_STATE = {
  phoneNumber: null,
  user: { id: "+919597891364", name: "Athithian" },
  name: null,
  image: null,
  loader: false,
  displayOtpForm: false,
  displayPhoneForm: true,
};

export const signUp = createAsyncThunk("user/signup", async (phoneNumber) => {
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
      size: "invisible",
    });
  } catch (error) {
    console.log(error);
  }
  await window.recaptchaVerifier.render();

  window.confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    window.recaptchaVerifier
  );
  return phoneNumber;
});

export const verifyCode = createAsyncThunk("user/verify", async (code) => {
  try {
    const user = await window.confirmationResult.confirm(code);
    return user;
  } catch (error) {
    console.log(error);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUp.fulfilled, (state, action) => {
        state.phoneNumber = action.payload;
        state.loader = false;
        state.displayOtpForm = true;
        state.displayPhoneForm = false;
      })
      .addCase(signUp.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.user = action.payload;
        state.displayOtpForm = false;
        state.loader = false;
      })
      .addCase(verifyCode.pending, (state, action) => {
        state.loader = true;
      });
  },
});

export const userReducer = userSlice.reducer;
export const userAction = userSlice.actions;
export const userSelector = (state) => state.userReducer;
