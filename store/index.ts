import { combineReducers } from "redux";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { statusLoginReducer } from "../reducer/loginStatusReducer";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  LoginQr: statusLoginReducer,
});

const store = configureStore({
  reducer: {
    LoginQr: statusLoginReducer,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
// type RootState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<typeof rootReducer>;

//type AppDispatch = typeof store.dispatch;

// const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store, useAppSelector };
