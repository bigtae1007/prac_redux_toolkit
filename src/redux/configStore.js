import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import memoReducer from "./modules/memoSlice";

const middlewares = [thunk];
const store = configureStore({
  reducer: {
    memo: memoReducer,
  },
  middleware: [...middlewares],
});

export default store;
