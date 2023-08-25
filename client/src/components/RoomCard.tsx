import React from "react";
import { Link } from "react-router-dom";

interface IRoom {
  roomname: string;
  description: string;
  isPasswordRequired: boolean;
  registeredUsers: any[];
  currentUsers: any[];
  messages?: [];
}

const Room: React.FC<IRoom> = ({
  roomname,
  description,
  isPasswordRequired,
  registeredUsers,
  currentUsers,
  messages,
}) => {
  return (
    <Link to={isPasswordRequired ? `/${roomname}/password` : `/${roomname}`}>
      <div className="room">
        <h3 className="room__roomname">{roomname}</h3>
        <p className="room__description">{description}</p>
        <div className="room__wrapper">
          <p className="room__wrapper__online">
            {currentUsers.length}/{registeredUsers.length}
          </p>
        </div>

        <p className="room__locked">
          {isPasswordRequired ? "Password Required" : ""}
        </p>
      </div>
    </Link>
  );
};

export default Room;
