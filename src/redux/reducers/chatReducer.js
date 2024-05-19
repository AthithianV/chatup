import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { conversationActions } from "./conversationReducer";
import notifyError from "../../util/notifyError";
import { decryptMessage, encryptMessage } from "../../util/encryptDecrypt";
import { importKey } from "../../util/encryptKey";

const initialState = {
  chats: [],
};

export const addChat = createAsyncThunk(
  "chat/add",
  async ({ text, sender, conversationId, key }, { dispatch }) => {
    try {
      // const IV = window.crypto.getRandomValues(new Uint8Array(12));
      // const encryptedText = await encryptMessage(text, key, IV);
      const chat = {
        sender: sender.name,
        text,
        time: Date.now(),
      };
      const docRef = doc(db, "Conversations", conversationId);
      await updateDoc(docRef, {
        chats: arrayUnion(chat),
        lastActivityAt: chat.time,
        lastChat: text,
      });

      dispatch(
        conversationActions.updateCurrentConversation({
          text,
          lastActivityAt: chat.time,
        })
      );

      return chat;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const loadChat = createAsyncThunk(
  "chat/load",
  ({ id, key }, { dispatch }) => {
    try {
      const docRef = doc(db, "Conversations", id);
      onSnapshot(docRef, async (doc) => {
        const chats = doc.data().chats;

        return chats;
      });
    } catch (error) {
      throw error;
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action) => {
      state.chats = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChat.rejected, (state, action) => {
        notifyError("Something Went Wrong!!!");
      })
      .addCase(addChat.rejected, (state, action) => {
        notifyError("Something Went Wrong!!!");
      });
  },
});

export const chatReducer = chatSlice.reducer;
export const chatAction = chatSlice.actions;
export const chatSelector = (state) => state.chatReducer;
