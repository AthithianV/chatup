import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const initialState = {
  chats: [],
};

export const addChat = createAsyncThunk(
  "chat/add",
  async ({ text, person, conversation }) => {

    const chat = { person, text, time: Date.now() };
    const docRef = doc(db, "Conversations", conversation);
    await updateDoc(docRef, { chats: arrayUnion(chat) });
  }
);

export const loadChat = createAsyncThunk("chat/load", async (name) => {
  const docRef = doc(db, "Conversations", name);
  const snapshot = await getDoc(docRef);
  const conversation = snapshot.data();
  return conversation.chats;
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadChat.fulfilled, (state, action) => {
      state.chats = action.payload;
    });
  },
});

export const chatReducer = chatSlice.reducer;
export const chatAction = chatSlice.actions;
export const chatSelector = (state) => state.chatReducer;
