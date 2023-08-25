import React, { useRef, useState } from "react";
import { createRoom } from "../store/slices/roomsSlice";
import { useAppDispatch } from "../store/hooks";
import { socket } from "../socket/socket";

export const CreateRoom = () => {
  const dispatch = useAppDispatch();

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [data, setData] = useState({
    roomname: "",
    description: "",
    currentUsers: [],
    registeredUsers: [],
    messages: [],
    isPasswordEnabled: false,
    password: "",
  });

  const onChangeText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onClickCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.checked });
  };

  const onClickSubmit = async () => {
    setData({
      roomname: "",
      description: "",
      isPasswordEnabled: false,
      currentUsers: [],
      registeredUsers: [],
      messages: [],
      password: "",
    });
    passwordRef.current!.value = "";
    dialogRef.current!.close();
    dispatch(createRoom(data));
  };

  const onClickCloseModal = () => {
    setData({
      roomname: "",
      description: "",
      isPasswordEnabled: false,
      currentUsers: [],
      registeredUsers: [],
      messages: [],
      password: "",
    });
    passwordRef.current!.value = "";
    dialogRef.current!.close();
  };

  return (
    <div className="create-room">
      <div
        className="create-room__plus"
        onClick={() =>
          dialogRef.current !== null ? dialogRef.current!.showModal() : null
        }
      >
        +
      </div>
      <h1 className="create-room__h1">Create Room</h1>
      <dialog ref={dialogRef} className="dialog">
        <div className="dialog__content">
          <div className="dialog__content__header">
            <h1>Create Room</h1>
            <h1
              className="dialog__content__header__close"
              onClick={() => onClickCloseModal()}
            >
              &times;
            </h1>
          </div>
          <div className="dialog__content__roomname">
            <label htmlFor="roomname">Room name:</label>
            <input
              id="roomname"
              type="text"
              className="input"
              placeholder="Room name..."
              name="roomname"
              onChange={(e) => onChangeText(e)}
              defaultValue={data.roomname}
            />
          </div>
          <div className="dialog__content__description">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              placeholder="Description..."
              name="description"
              className="input"
              onChange={(e) => onChangeText(e)}
              rows={5}
              defaultValue={data.description}
            ></textarea>
          </div>
          <div className="dialog__content__checkbox">
            <label htmlFor="checkbox">Password Required?</label>
            <input
              id="checkbox"
              type="checkbox"
              name="isPasswordEnabled"
              onChange={(e) => onClickCheckbox(e)}
              checked={data.isPasswordEnabled}
            />
          </div>
          <div className="dialog__content__password">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              placeholder="Password..."
              className="input"
              name="password"
              type="password"
              disabled={data.isPasswordEnabled ? false : true}
              ref={passwordRef}
            />
          </div>

          <button
            onClick={() => onClickSubmit()}
            className="btn dialog__content__submit"
          >
            Submit
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default CreateRoom;
