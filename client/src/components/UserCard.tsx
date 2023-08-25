import React from "react";

interface IUserCard {
  username: string;
}

const UserCard: React.FC<IUserCard> = ({ username }) => {
  return (
    <div className="user-card">
      <div className="user-card__username">{username}</div>
      <div className="user-card__dot">
        <div></div>
      </div>
    </div>
  );
};

export default UserCard;
