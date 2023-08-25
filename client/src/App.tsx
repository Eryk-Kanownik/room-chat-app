import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoomsPage } from "./pages/RoomsPage";
import { ChatRoomPage } from "./pages/ChatRoomPage";
import { socket } from "./socket/socket";
import { useAppDispatch } from "./store/hooks";
import { loginUser } from "./store/slices/loggedUserSlice";
import PasswordScreen from "./components/PasswordScreen";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("username") !== null) {
      dispatch(loginUser(localStorage.getItem("username")));
      socket.emit("new-user", { username: localStorage.getItem("username") });
    } else {
      const username = prompt("Username");
      localStorage.setItem("username", username!);
      dispatch(loginUser(localStorage.getItem("username")));
      socket.emit("new-user", username);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RoomsPage />} path="/" />
        <Route element={<ChatRoomPage />} path="/:roomname" />
        <Route element={<PasswordScreen />} path="/:roomname/password" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
