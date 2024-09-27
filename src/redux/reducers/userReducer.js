import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import {
  addDoc,
  arrayUnion,
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

export const addContact = createAsyncThunk("user/addContact", async () => {
  const users = [
    "Andre",
    "Darren",
    "David",
    "Diana",
    "Josh",
    "Olivia",
    "Parker",
    "Robin",
  ];
  users.forEach(async (u) => {
    await updateDoc(doc(db, "users", u), {
      contacts: arrayUnion({
        id: "Ig2eNx43ZEKpDrHOCsl2",
        name: "Guest",
        image:
          "https://firebasestorage.googleapis.com/v0/b/chatap-b6d99.appspot.com/o/image%2FLotus.png?alt=media&token=17d635ba-4263-4fe4-b856-dffa9b01929c",
      }),
    });
  });
});

export const login = createAsyncThunk("user/login", async ({ email, password }) => {
  try {

    const userCredentials = await signInWithEmailAndPassword(auth, {
      email, password
    })

    const snapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
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
      query(collection(db, "users"), where("username", "==", user.username))
    );

    if (!snapshot.empty) {
      notifyError("The Phone number is Alreay Registerd");
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
      user.password,
    );

    let userData = {
      uid: userCredentials.user.uid,
      name: user.name,
      countryCode: user.code,
      phoneNumber: user.phone,
      image: null,
      conversations: [],
      contacts: [],
      lastSeen: Date.now(),
    };

    const docRef = await addDoc(collection(db, "users"), userData);
    await updateDoc(docRef, { id: docRef.id });
    userData.id = docRef.id;

    return true;

  } catch (error) {
    console.log(error);
    throw error;
  }
});


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
        console.log(action.error);
        
        if(action.error.code === "auth/email-already-in-use"){
          notifyError("Email Already Exists.");
        }else{
          notifyError("Something Went wrong");
        }
      });
  },
});

export const userReducer = userSlice.reducer;
export const userAction = userSlice.actions;
export const userSelector = (state) => state.userReducer;
