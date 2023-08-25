import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "../store/hooks";

const PasswordScreen = () => {
  const navigate = useNavigate();
  const { joinedRooms } = useAppSelector((state) => state.loggedUser);
  const { roomname } = useParams();
  const [password, setPassword] = useState<string>("");
  const [enteredPassword, setEnteredPassword] = useState<string>("");

  useEffect(() => {
    async function getPassword() {
      let res = await axios.get(`http://localhost:5000/rooms/${roomname}`);
      setPassword(res.data.password);
    }
    getPassword();
    let index = joinedRooms.indexOf(roomname!);
    if (index !== -1) {
      navigate(`/${roomname}`);
    }
  }, []);

  const submit = () => {
    if (enteredPassword === password) {
      navigate(`/${roomname}`);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredPassword(e.target.value);
  };

  return (
    <Navbar>
      <div className="password-screen">
        <div className="password-screen__informations">
          <h1> is password restricted</h1>
          <h3>Enter the password to get in to room</h3>
          <input type="text" className="input" onChange={(e) => onChange(e)} />
          <button className="btn" onClick={() => submit()}>
            Submit
          </button>
        </div>
      </div>
    </Navbar>
  );
};

export default PasswordScreen;
