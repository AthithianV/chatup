import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
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
import Cookies from "js-cookie";

import { auth, db } from "../../firebase/firebase";
import notifyError from "../../util/notifyError";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const INITIAL_STATE = {
  user: null,
  loader: false,
  displayContact: false,
  contacts: [],
};

export const register = createAsyncThunk("user/register", async (user) => {
  try {
    const snapshot = await getDocs(
      query(collection(db, "users"), where("username", "==", user.username))
    );

    if (!snapshot.empty) {
      notifyError("Username Alreay Exists!");
      return null;
    }

    // let storage = getStorage();
    // let imageRef = ref(storage, "image/" + user.image.name);
    // await uploadBytes(imageRef, user.image);
    // const downloadUrl = await getDownloadURL(imageRef);

    // user.image = downloadUrl;

    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );

    let userData = {
      uid: userCredentials.user.uid,
      username: user.username,
      email: user.email,
      image: null,
      conversations: [],
      contacts: [],
      lastSeen: Date.now(),
    };

    console.log(userData);

    const docRef = await addDoc(collection(db, "users"), userData);
    await updateDoc(docRef, { id: docRef.id });
    userData.id = docRef.id;

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const snapshot = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );

      let user;
      snapshot.forEach((snap) => (user = snap.data()));

      Cookies.set("authToken", userCredentials.user.accessToken, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
        path: "/",
      });

      Cookies.set("userId", user.id, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
        path: "/",
      });

      return user.id;
    } catch (error) {
      throw error;
    }
  }
);

export const logout = createAsyncThunk("user/signout", async () => {
  try {
    await signOut(auth);
    Cookies.remove("authToken");
    Cookies.remove("userId");
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const getContacts = createAsyncThunk("user/getContent", async (user) => {
  try {
    const snapshot = await getDoc(doc(db, "users", user));
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
        state.user = action.payload;
        state.loader = false;
      })
      .addCase(login.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(login.rejected, (state, action) => {
        console.log(action.error);
        if (action.error.code === "auth/invalid-credential") {
          notifyError("Wrong Email/Password");
        } else {
          notifyError("Something Went Wrong");
        }
        state.loader = false;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.contacts = action.payload;
      })
      .addCase(getContacts.rejected, (state, action) => {
        notifyError("Something Went Wrong");
      })
      .addCase(register.fulfilled, (state, action) => {
        state.tempUser = action.payload;
        state.loader = false;
      })
      .addCase(register.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(register.rejected, (state, action) => {
        if (action.error.code === "auth/email-already-in-use") {
          notifyError("Email Already Exists.");
        } else {
          notifyError("Something Went wrong");
        }
        state.loader = false;
      });
  },
});

export const userReducer = userSlice.reducer;
export const userAction = userSlice.actions;
export const userSelector = (state) => state.userReducer;
