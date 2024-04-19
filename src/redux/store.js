import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { sidebarReducer } from "./reducers/sidebarReducer";

const store = configureStore({ reducer: { userReducer, sidebarReducer } });
export default store;
