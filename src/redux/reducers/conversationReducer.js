import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const initialState = {
  current_conversation: null,
  conversations: [],
  loader: false,
};

export const getConversations = createAsyncThunk(
  "conversation/get",
  async (user) => {
    try {
      const userRef = doc(db, "users", user.id);
      // Get userData.
      const snapshot = await getDoc(userRef);
      const userData = snapshot.data();

      // Form an array of conversation from userData

      // Forming an array of Promises
      const conversationsPromises = userData.Conversation.map(
        async (docRef) => {
          const snapshot = await getDoc(docRef);
          const result = snapshot.data();

          result.title = result.name;

          //   To get name and image for the chats
          if (result.type == "one-one") {
            const friendRef = result.members.find((m) => {
              return m.id != user.id;
            });
            const friendDataSnap = await getDoc(friendRef);
            const friendData = friendDataSnap.data();
            result.image = friendData.image;
            result.name = friendData.name;
          }

          result.lastChat = result.chats.pop().text;

          delete result.members;
          delete result.chats;
          delete result.type;

          return result;
        }
      );

      // Forming conversation data array.
      const conversations = await Promise.all(conversationsPromises);
      return conversations;
    } catch (error) {
      console.log(error);
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConverstion: (state, action) => {
      state.current_conversation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.loader = false;
      })
      .addCase(getConversations.pending, (state, action) => {
        state.loader = true;
      });
  },
});

export const conversationReducer = conversationSlice.reducer;
export const conversationActions = conversationSlice.actions;
export const conversationSelector = (state) => state.conversationReducer;
