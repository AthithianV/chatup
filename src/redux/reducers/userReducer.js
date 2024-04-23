import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import notifyError from "../../util/notifyError";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const INITIAL_STATE = {
  user: null,
  tempUser: null,
  loader: false,
  displayContact: false,
  contacts: [],
};

export const login = createAsyncThunk("user/login", async ({ code, phone }) => {
  try {
    const snapshot = await getDocs(
      query(collection(db, "users"), where("phoneNumber", "==", phone))
    );

    if (snapshot.empty) {
      notifyError("User Not found, Please Register");
      return null;
    }

    console.log(snapshot);

    window.recaptchaVerifier = new RecaptchaVerifier(auth, "login-button", {
      size: "invisible",
    });
    await window.recaptchaVerifier.render();

    window.confirmationResult = await signInWithPhoneNumber(
      auth,
      "+" + code + phone,
      window.recaptchaVerifier
    );

    let user;
    snapshot.forEach((snap) => {
      user = doc.data();
    });

    return {
      name: user.name,
      phone: user.phoneNumber,
      code: user.countryCode,
      image: user.image,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const register = createAsyncThunk("user/register", async (user) => {
  try {
    const snapshot = await getDocs(
      query(collection(db, "users"), where("phoneNumber", "==", user.phone))
    );

    if (!snapshot.empty) {
      notifyError("The Phone number is Alreay Registerd");
      return null;
    }

    let storage = getStorage();
    let imageRef = ref(storage, "image/" + user.image.name);
    await uploadBytes(imageRef, user.image);
    const downloadUrl = await getDownloadURL(imageRef);

    user.image = downloadUrl;

    window.recaptchaVerifier = new RecaptchaVerifier(auth, "register-button", {
      size: "invisible",
    });
    await window.recaptchaVerifier.render();

    window.confirmationResult = await signInWithPhoneNumber(
      auth,
      "+" + user.code + user.phone,
      window.recaptchaVerifier
    );

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const verifyCode = createAsyncThunk(
  "user/verify",
  async ({ user, code }) => {
    try {
      const userCredentials = await window.confirmationResult.confirm(code);
      const phone = userCredentials.user.phoneNumber;

      let userData = {
        uid: userCredentials.user.uid,
        name: user.name,
        countryCode: user.code,
        phoneNumber: user.phone,
        image: user.image,
        conversations: [],
        contacts: [],
        lastSeen: Date.now(),
      };
      const userSnapshot = await getDocs(
        query(collection(db, "users"), where("phoneNumber", "==", phone))
      );

      if (userSnapshot.empty) {
        const docRef = await addDoc(collection(db, "users"), userData);
        await updateDoc(docRef, { id: docRef.id });
        userData.id = docRef.id;
      } else {
        userSnapshot.forEach((s) => {
          userData = s.data();
        });
      }

      const data = {
        id: userData.id,
        name: userData.name,
        image: userData.image,
      };

      localStorage.setItem("chatup-user", JSON.stringify(data));

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const logout = createAsyncThunk("user/signout", async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("chatup-user");
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const getContacts = createAsyncThunk("user/getContent", async (user) => {
  try {
    const snapshot = await getDoc(doc(db, "users", user.id));
    const contacts = snapshot.data().contacts;

    return contacts;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const setNameImage = createAsyncThunk("user/setName", async () => {});

const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    switchDisplayContact: (state, action) => {
      state.displayContact = !state.displayContact;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.tempUser = action.payload;
        state.loader = false;
      })
      .addCase(login.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(login.rejected, (state, action) => {
        notifyError("Something Went Wrong");
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loader = false;
      })
      .addCase(verifyCode.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        if (action.error.name === "auth/code-expired") {
          notifyError("Code Expired, Please Try Again");
          action.state.tempUser = null;
        }
        notifyError("Something Went Wrong");
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.contacts = action.payload;
      })
      .addCase(getContacts.rejected, (state, action) => {
        notifyError("Something Went Wrong");
      })
      .addCase(register.fulfilled, (state, action) => {
        state.tempUser = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        notifyError("Something Went wrong");
      });
  },
});

export const userReducer = userSlice.reducer;
export const userAction = userSlice.actions;
export const userSelector = (state) => state.userReducer;
