import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import notifyError from "../../util/notifyError";
import notifySuccess from "../../util/notifySuccess";

const initialState = {
  current_conversation: null,
  conversations: [],
  loader: false,
};

export const addConversation = createAsyncThunk(
  "conversation/add",
  async ({ user, friend }, { dispatch }) => {
    try {
      // Create Reference for User and Friend
      const friendRef = doc(db, "users", friend.id);
      const userRef = doc(db, "users", user.id);

      // Check if friend Exists.
      const friendSnapShot = await getDoc(friendRef);
      const friendDoc = friendSnapShot.data();
      if (!friendDoc) {
        return;
      }

      // Check if conversation already exists,
      const userSnapshot = await getDoc(userRef);
      const userConversations = userSnapshot.data().conversations;

      const foundConversation = userConversations.find(
        (c) => c.user.id === friend.id
      );

      // If exists set current conversation to found conversation.
      if (foundConversation) {
        const snapshot = await getDoc(foundConversation.conversationRef);
        const data = snapshot.data();

        dispatch(
          conversationActions.setCurrentConversation({
            id: data.id,
            name: foundConversation.user.name,
            image: foundConversation.user.image,
          })
        );
        return;
      }

      const name = `${user.name}-${friend.name}`;
      const chats = [];
      const lastActivityAt = Date.now();
      const members = [userRef, friendRef];
      const type = "individual";
      const lastChat = "";

      const obj = {
        name,
        chats,
        lastActivityAt,
        members,
        type,
        lastChat,
      };

      const docRef = await addDoc(collection(db, "Conversations"), obj);
      await updateDoc(docRef, { id: docRef.id });

      await updateDoc(userRef, {
        conversations: arrayUnion({
          conversationRef: docRef,
          user: { name: friend.name, image: friendDoc.image, id: friend.id },
          type: "individual",
        }),
      });
      await updateDoc(friendRef, {
        conversations: arrayUnion({
          conversationRef: docRef,
          user: { name: user.name, image: user.image, id: user.id },
          type: "individual",
        }),
      });

      return {
        id: docRef.id,
        name: friend.name,
        image: friendDoc.image,
        lastActivityAt: obj.lastActivityAt,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const pickConversation = createAsyncThunk(
  "conversation/pick",
  async ({ id, user }, { dispatch }) => {
    try {
      const snapshot = await getDoc(doc(db, "Conversations", id));
      const conversation = snapshot.data();

      let userRef = conversation.members[1];
      if (conversation.members[0].id !== user.id) {
        userRef = conversation.members[0];
      }

      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
      conversation.image = userData.image;
      conversation.name = userData.name;

      delete conversation.members;
      delete conversation.chats;
      delete conversation.type;

      dispatch(conversationActions.setCurrentConversation(conversation));
    } catch (error) {
      throw error;
    }
  }
);

export const getConversations = createAsyncThunk(
  "conversation/get",
  async (user, { dispatch }) => {
    try {
      const userRef = doc(db, "users", user.id);
      // Get userData.
      onSnapshot(userRef, async (doc) => {
        const userData = doc.data();

        // Form an array of conversation from userData

        // Forming an array of Promises
        const conversationsPromises = userData.conversations.map(
          async ({ conversationRef, user, type }) => {
            const snapshot = await getDoc(conversationRef);
            const result = snapshot.data();
            result.id = snapshot.id;

            if (type === "individual") {
              result.image = user.image;
              result.name = user.name;
            }

            delete result.members;
            delete result.chats;
            delete result.type;

            return result;
          }
        );

        // Forming conversation data array.
        const conversations = await Promise.all(conversationsPromises);

        dispatch(conversationActions.setConversations(conversations));
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setCurrentConversation: (state, action) => {
      state.current_conversation = action.payload;
    },
    updateCurrentConversation: (state, action) => {
      const { text, lastActivityAt } = action.payload;
      state.current_conversation.lastActivityAt = lastActivityAt;
      const index = state.conversations.findIndex(
        (c) => c.name === state.current_conversation.name
      );
      state.conversations[index].lastActivityAt = lastActivityAt;
      state.conversations[index].lastChat = text;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.rejected, (state, action) => {
        notifyError("Something Went Wrong!!!");
      })
      .addCase(addConversation.fulfilled, (state, action) => {
        if (action.payload) {
          state.current_conversation = action.payload;
          state.conversations.push(action.payload);
          notifySuccess("New Convesation has been created!!!");
        }
      })
      .addCase(addConversation.rejected, (state, action) => {
        notifyError("Something Went Wrong!!!");
      })
      .addCase(pickConversation.rejected, (state, action) => {
        notifyError("Something Went Wrong!!!");
      });
  },
});

export const conversationReducer = conversationSlice.reducer;
export const conversationActions = conversationSlice.actions;
export const conversationSelector = (state) => state.conversationReducer;
