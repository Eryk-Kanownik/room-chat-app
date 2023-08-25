import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { act } from "@testing-library/react";
import axios from "axios";

interface IRoom {
  roomname: string;
  description: string;
  isPasswordRequired: boolean | null;
  currentUsers: any[];
  registeredUsers: any[];
  messages: any[];
  password: string;
}

interface roomsState {
  rooms: IRoom[];
  singleRoom: {
    roomname: string;
    description: string;
    isPasswordRequired: boolean | null;
    currentUsers: any[];
    registeredUsers: any[];
    messages: any[];
  };
  status: "idle" | "loading" | "failed";
}

const initialState: roomsState = {
  rooms: [],
  singleRoom: {
    roomname: "",
    description: "",
    messages: [],
    currentUsers: [],
    registeredUsers: [],
    isPasswordRequired: null,
  },
  status: "idle",
};

export const getRooms = createAsyncThunk("rooms/getRooms", async () => {
  let res = await axios.get("http://localhost:5000/rooms");
  return res.data;
});

export const getSingleRoom = createAsyncThunk(
  "rooms/getSingleRoom",
  async (roomname: any) => {
    let res = await axios.get(`http://localhost:5000/rooms/${roomname}`);
    return res.data;
  }
);

export const createRoom = createAsyncThunk(
  "rooms/createRoom",
  async (newRoom: any) => {
    let res = await axios.post("http://localhost:5000/rooms", newRoom);
    return res.data;
  }
);

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    loadRoom: (state, action) => {
      state.singleRoom = action.payload;
    },
    sendMessage: (state, action) => {
      state.singleRoom.messages = [
        ...state.singleRoom.messages,
        action.payload,
      ];
    },
    updateUsers: (state, action) => {
      state.singleRoom.currentUsers = action.payload;
    },
    updateRooms: (state, action) => {
      state.rooms = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRooms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRooms.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getRooms.fulfilled, (state, action) => {
        state.status = "idle";
        state.rooms = action.payload;
      })
      .addCase(createRoom.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createRoom.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.status = "idle";
        state.rooms = [...state.rooms, action.payload];
      })
      .addCase(getSingleRoom.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSingleRoom.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getSingleRoom.fulfilled, (state, action) => {
        state.status = "idle";
        state.singleRoom = action.payload;
      });
  },
});

export const { sendMessage, updateUsers, updateRooms } = roomsSlice.actions;

export default roomsSlice.reducer;
