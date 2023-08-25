import React from "react";
import { useAppSelector } from "../store/hooks";

interface IMessage {
  username?: string;
  message: string;
}

const Message: React.FC<IMessage> = ({ username, message }) => {
  const user = useAppSelector((state) => state.loggedUser.username);

  return (
    <div
      className="message"
      style={{ alignSelf: user === username ? "flex-end" : "flex-start" }}
    >
      <h3>{username}</h3>
      <p>{message}</p>
    </div>
  );
};

export default Message;
