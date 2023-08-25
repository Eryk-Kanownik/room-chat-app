import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoggedUserState {
  username: string | null;
  joinedRooms: string[];
  status: "idle" | "loading" | "failed";
}

const initialState: LoggedUserState = {
  username:
    localStorage.getItem("username") !== null
      ? localStorage.getItem("username")
      : "",
  joinedRooms: [],
  status: "idle",
};

export const loggedUserSlice = createSlice({
  name: "loggedUser",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.username = action.payload;
    },
    updateJoinedRooms: (state, action) => {
      state.joinedRooms = action.payload;
    },
  },
});

export const { loginUser, updateJoinedRooms } = loggedUserSlice.actions;

export default loggedUserSlice.reducer;
