import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import notifyError from "../../util/notifyError";

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
      const userConversations = userSnapshot.data().Conversation;
      const promises = userConversations.map(async (c) => {
        const snapshot = await getDoc(c);
        return snapshot.data();
      });
      const conversations = await Promise.all(promises);
      const foundConversation = conversations.find((c) =>
        c.name.includes(friend.name)
      );

      // If exists set current conversation to found conversation.
      if (foundConversation) {
        foundConversation.title = foundConversation.name;
        foundConversation.name = friendDoc.name;
        foundConversation.image = friendDoc.image;

        delete foundConversation.members;
        delete foundConversation.chats;
        delete foundConversation.type;

        console.log(foundConversation);

        dispatch(conversationActions.setConversation(foundConversation));
        return;
      }

      const name = `${user.name}-${friend.name}`;
      const chats = [];
      const lastActivityAt = Date.now();
      const members = [userRef, friendRef];
      const type = "one-one";
      const lastChat = "";

      const obj = {
        name,
        chats,
        lastActivityAt,
        members,
        type,
        lastChat,
      };

      const docRef = doc(db, "Conversations", name);
      await setDoc(docRef, obj);

      await updateDoc(userRef, { Conversation: arrayUnion(docRef) });
      await updateDoc(friendRef, { Conversation: arrayUnion(docRef) });

      return {
        title: obj.name,
        name: friend.name,
        image: friendDoc.image,
        lastActivityAt: obj.lastActivityAt,
      };
    } catch (error) {
      throw error;
    }
  }
);

export const pickConversation = createAsyncThunk(
  "conversation/pick",
  async ({ title, user }, { dispatch }) => {
    try {
      const snapshot = await getDoc(doc(db, "Conversations", title));
      const conversation = snapshot.data();
      conversation.title = conversation.name;

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

      dispatch(conversationActions.setConversation(conversation));
    } catch (error) {
      throw error;
    }
  }
);

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
          if (result.type === "one-one") {
            const friendRef = result.members.find((m) => {
              return m.id !== user.id;
            });
            const friendDataSnap = await getDoc(friendRef);
            const friendData = friendDataSnap.data();
            result.image = friendData.image;
            result.name = friendData.name;
          }

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
      throw error;
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversation: (state, action) => {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.loader = false;
      })
      .addCase(getConversations.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(getConversations.rejected, (state, action) => {
        notifyError("Something Went Wrong!!!");
      })
      .addCase(addConversation.fulfilled, (state, action) => {
        if (action.payload) {
          state.current_conversation = action.payload;
          state.conversations.push(action.payload);
          notifyError("New Convesation has been created!!!");
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
