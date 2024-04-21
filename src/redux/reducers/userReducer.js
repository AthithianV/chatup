import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import notifyError from "../../util/notifyError";

const INITIAL_STATE = {
  phoneNumber: null,
  user: { id: "+919597891364", name: "Athithian" },
  name: null,
  image: null,
  loader: false,
  displayOtpForm: false,
  displayPhoneForm: true,
  displayContact: false,
  contacts: [],
};

export const signUp = createAsyncThunk("user/signup", async (phoneNumber) => {
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
      size: "invisible",
    });
    await window.recaptchaVerifier.render();

    window.confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier
    );
    return phoneNumber;
  } catch (error) {
    throw error;
  }
});

export const verifyCode = createAsyncThunk("user/verify", async (code) => {
  try {
    const user = await window.confirmationResult.confirm(code);
    console.log(user);
    return user;
  } catch (error) {
    throw error;
  }
});

export const getContacts = createAsyncThunk("user/getContent", async (user) => {
  try {
    const snapshot = await getDoc(doc(db, "users", user.id));
    const userRefs = snapshot.data().Contacts;

    const promises = userRefs.map(async (userRef) => {
      const snapshot = await getDoc(userRef);
      const user = snapshot.data();
      return { name: user.name, image: user.image, id: snapshot.id };
    });

    const contacts = await Promise.all(promises);

    return contacts;
  } catch (error) {
    throw error;
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    switchDisplayContact: (state, action) => {
      state.displayContact = !state.displayContact;
    },
  },
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
      .addCase(signUp.rejected, (state, action) => {
        notifyError("Something Went Wrong");
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.user = action.payload;
        state.displayOtpForm = false;
        state.loader = false;
      })

      .addCase(verifyCode.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        notifyError("Something Went Wrong");
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.contacts = action.payload;
      })
      .addCase(getContacts.rejected, (state, action) => {
        notifyError("Something Went Wrong");
      });
  },
});

export const userReducer = userSlice.reducer;
export const userAction = userSlice.actions;
export const userSelector = (state) => state.userReducer;
