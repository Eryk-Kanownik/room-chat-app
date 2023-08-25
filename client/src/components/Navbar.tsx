import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { socket } from "../socket/socket";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateJoinedRooms } from "../store/slices/loggedUserSlice";

interface INavbar {
  children: JSX.Element;
}

const Navbar: React.FC<INavbar> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { joinedRooms } = useAppSelector((state) => state.loggedUser);
  useEffect(() => {
    socket.on("joined-rooms", (joinedRooms) => {
      dispatch(updateJoinedRooms(joinedRooms));
    });
  }, [socket]);

  return (
    <nav className="navbar">
      <div className="navbar__content">
        <Link to="/">
          <div className="navbar__content__logo">ChatApp</div>
        </Link>
        <div className="navbar__content__links">
          {joinedRooms?.map((jr, key) => (
            <Link
              key={key}
              className="navbar__content__links__item"
              to={`/${jr}`}
            >
              {jr}
            </Link>
          ))}
        </div>
      </div>
      <div className="navbar__children">{children}</div>
    </nav>
  );
};

export default Navbar;
