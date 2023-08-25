import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Room from "../components/RoomCard";
import CreateRoom from "../components/CreateRoom";
import axios from "axios";

import { socket } from "../socket/socket";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getRooms, updateRooms } from "../store/slices/roomsSlice";

export const RoomsPage = () => {
  const dispatch = useAppDispatch();
  const rooms = useAppSelector((state) => state.rooms.rooms);

  useEffect(() => {
    dispatch(getRooms());
  }, []);

  useEffect(() => {
    socket.on("update-rooms", (rooms) => {
      dispatch(updateRooms(rooms));
    });
  }, [socket]);

  const roomsElements = rooms.map((room: any, index: number) => (
    <Room
      key={index}
      roomname={room.roomname}
      description={room.description}
      isPasswordRequired={room.isPasswordEnabled}
      currentUsers={room.currentUsers}
      registeredUsers={room.registeredUsers}
    />
  ));

  return (
    <Navbar>
      <div className="roomspage">
        <div className="roomspage__header">
          <h1 className="roomspage__header__h1">Search for rooms</h1>
          <div className="roomspage__header__wrapper">
            <input
              type="text"
              className="input roomspage__header__wrapper__input"
            />
          </div>
        </div>
        <div className="roomspage__rooms">
          <div className="roomspage__rooms__items">
            {roomsElements}
            <CreateRoom />
          </div>
        </div>
      </div>
    </Navbar>
  );
};
