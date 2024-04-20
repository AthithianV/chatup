import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { conversationReducer } from "./reducers/conversationReducer";
import { chatReducer } from "./reducers/chatReducer";

const store = configureStore({
  reducer: { userReducer, conversationReducer, chatReducer },
});
export default store;
