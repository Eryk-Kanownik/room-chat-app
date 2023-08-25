import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import loggedUserSlice from "./slices/loggedUserSlice";
import roomsSlice from "./slices/roomsSlice";

export const store = configureStore({
  reducer: {
    loggedUser: loggedUserSlice,
    rooms: roomsSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
