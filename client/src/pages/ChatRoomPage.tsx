import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Message from "../components/Message";
import UserCard from "../components/UserCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  getSingleRoom,
  sendMessage,
  updateUsers,
} from "../store/slices/roomsSlice";
import { useParams } from "react-router-dom";
import { socket } from "../socket/socket";

export const ChatRoomPage = () => {
  const { roomname } = useParams();
  const dispatch = useAppDispatch();
  const { singleRoom } = useAppSelector((state) => state.rooms);
  const { username } = useAppSelector((state) => state.loggedUser);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    socket.emit("join-room", { username, roomname });
    dispatch(getSingleRoom(roomname));
    return () => {
      socket.emit("leave-room", { username, roomname });
    };
  }, []);

  useEffect(() => {
    socket.on("new-message", ({ username, message }) => {
      dispatch(sendMessage({ username, message }));
    });
    socket.on("user-joined", ({ message, currentUsers }) => {
      dispatch(updateUsers(currentUsers));
      dispatch(sendMessage({ message }));
    });
    socket.on("user-left", ({ message, currentUsers }) => {
      dispatch(updateUsers(currentUsers));
      dispatch(sendMessage({ message }));
    });
  }, [socket]);

  const addMessage = () => {
    socket.emit("message-out", {
      username,
      message,
      roomname,
    });
    dispatch(sendMessage({ username, message }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  let messages: any = singleRoom.messages
    ? singleRoom.messages.map((message: any, key: number) => (
        <Message
          key={key}
          username={message.username}
          message={message.message}
        />
      ))
    : null;

  return (
    <Navbar>
      <div className="chat-room-page">
        <div className="chat-room-page__left">
          <div className="chat-room-page__left__users">
            <div className="chat-room-page__left__users__header">
              <div>Users</div>
              <div>
                {singleRoom.currentUsers
                  ? singleRoom.currentUsers.length
                  : null}
              </div>
            </div>
            {singleRoom?.currentUsers?.map((user: any, key: React.Key) => (
              <UserCard key={key} username={user?.username} />
            ))}
          </div>
        </div>
        <div>
          <div className="chat-room-page__right">
            <div className="chat-room-page__right__header">
              <h1 className="chat-room-page__right__header__h1">
                {singleRoom.roomname}
              </h1>
              <p className="chat-room-page__right__header__h3">
                {singleRoom.description}
              </p>
            </div>
            <div className="chat-room-page__right__messages">{messages}</div>
            <div className="chat-room-page__right__form">
              <input
                className="input"
                placeholder="Say hello to everyone :)"
                type="text"
                onChange={(e) => onChange(e)}
                defaultValue={message}
              />
              <button className="btn" onClick={() => addMessage()}>
                &#9654;
              </button>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};
