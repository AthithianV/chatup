import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { conversationActions } from "./conversationReducer";
import notifyError from "../../util/notifyError";

const initialState = {
  chats: [],
};

export const addChat = createAsyncThunk(
  "chat/add",
  async ({ text, person, conversation }, { dispatch }) => {
    const chat = { person, text, time: Date.now() };
    const docRef = doc(db, "Conversations", conversation);

    try {
      await updateDoc(docRef, {
        chats: arrayUnion(chat),
        lastActivityAt: Date.now(),
        lastChat: text,
      });

      dispatch(
        conversationActions.updateCurrentConversation({
          text,
          lastActivityAt: Date.now(),
        })
      );

      return chat;
    } catch (error) {
      throw error;
    }
  }
);

export const loadChat = createAsyncThunk("chat/load", async (name) => {
  try {
    const docRef = doc(db, "Conversations", name);
    const snapshot = await getDoc(docRef);
    const conversation = snapshot.data();
    return conversation.chats;
  } catch (error) {
    throw error;
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadChat.fulfilled, (state, action) => {
        state.chats = action.payload;
      })
      .addCase(loadChat.rejected, (state, action) => {
        notifyError("Something Went Wrong!!!");
      })
      .addCase(addChat.fulfilled, (state, action) => {
        state.chats.push(action.payload);
      })
      .addCase(addChat.rejected, (state, action) => {
        notifyError("Something Went Wrong!!!");
      });
  },
});

export const chatReducer = chatSlice.reducer;
export const chatAction = chatSlice.actions;
export const chatSelector = (state) => state.chatReducer;
