import express, { Application, json } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const PORT = 5000;

const app: Application = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

interface IUser {
  username: string;
  socketId: string;
  currentRoom: string;
  joinedRooms: string[];
}

interface IMessage {
  username?: string;
  message: string;
}

interface IRoom {
  roomname: string;
  description: string;
  registeredUsers: IUser[];
  currentUsers: IUser[];
  messages: IMessage[];
  isPasswordEnabled: boolean;
  password: string;
}

const users: IUser[] = [];

const rooms: IRoom[] = [
  {
    roomname: "test1",
    description: "Welcome to test room",
    currentUsers: [],
    registeredUsers: [],
    messages: [],
    isPasswordEnabled: false,
    password: "string",
  },
  {
    roomname: "test2",
    description:
      "Welcome to test room, this room requires password to join, password is test123",
    currentUsers: [],
    registeredUsers: [],
    messages: [],
    isPasswordEnabled: true,
    password: "test123",
  },
];

app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
  socket.on("new-user", ({ username }) => {
    //Add user to users array
    let userIndex = users.map((user) => user.username).indexOf(username);
    if (userIndex === -1) {
      let user = {
        username,
        socketId: socket.id,
        currentRoom: "",
        joinedRooms: [],
      };
      users.push(user);
    }
  });

  socket.on("message-out", ({ roomname, message, username }) => {
    rooms[
      rooms.map((room) => room.roomname)?.indexOf(roomname)
    ]?.messages?.push({
      username,
      message,
    });
    io.to(roomname).emit("new-message", { username, message });
  });

  socket.on("join-room", ({ username, roomname }) => {
    //check if user already exist in room if not add user

    let userCurrentIndex = users
      ?.map((user) => user.username)
      ?.indexOf(username);

    let roomIndex = rooms.map((room) => room.roomname)?.indexOf(roomname);

    let userRegisteredIndex = rooms[roomIndex].registeredUsers
      ?.map((user) => user?.username)
      ?.indexOf(username);

    let userExistInRoom = rooms[roomIndex]?.currentUsers
      ?.map((user) => user?.username)
      ?.indexOf(users[userCurrentIndex]?.username);

    //set users current room
    if (users[userCurrentIndex]?.username === username) {
      users[userCurrentIndex] = {
        ...users[userCurrentIndex],
        currentRoom: roomname,
      };
    }

    //add user to room
    if (userExistInRoom === -1) {
      rooms[roomIndex].currentUsers.push(users[userCurrentIndex]);
    }

    //add room to users joined rooms
    if (users[userCurrentIndex]?.joinedRooms?.indexOf(roomname) === -1) {
      users[userCurrentIndex]?.joinedRooms?.push(roomname);
    }

    //add user to registered users
    if (userRegisteredIndex === -1) {
      rooms[roomIndex]?.registeredUsers.push(users[userCurrentIndex]);
    }
    //

    //socket logic
    socket.join(roomname);

    let { registeredUsers, currentUsers } = rooms[roomIndex];

    io.to(roomname).emit("user-joined", {
      message: `${username} joined to room!`,
      currentUsers,
      registeredUsers,
    });

    rooms[
      rooms.map((room) => room.roomname)?.indexOf(roomname)
    ]?.messages?.push({ message: `${username} joined to room!` });

    let joinedRooms = users[userCurrentIndex]?.joinedRooms;
    socket.emit("joined-rooms", joinedRooms);
    io.sockets.emit("update-rooms", rooms);
  });

  socket.on("leave-room", ({ username, roomname }) => {
    //delete user form room
    let userIndex = users.map((user) => user.username)?.indexOf(username);
    let roomIndex = rooms.map((room) => room.roomname)?.indexOf(roomname);
    let userIndexInRoom = rooms[roomIndex]?.currentUsers
      ?.map((user) => user?.username)
      ?.indexOf(username);

    if (userIndexInRoom !== -1) {
      users[userIndex] = { ...users[userIndex], currentRoom: "" };
      rooms[roomIndex]?.currentUsers?.splice(userIndexInRoom, 1);
    }

    //socket logic
    socket.leave(roomname);
    let { currentUsers } = rooms[roomIndex];

    io.to(roomname).emit("user-left", {
      message: `${username} left the room!`,
      currentUsers,
    });

    rooms[
      rooms.map((room) => room.roomname)?.indexOf(roomname)
    ]?.messages?.push({ message: `${username} left the room!` });

    io.sockets.emit("update-rooms", rooms);
  });

  socket.on("disconnect", () => {
    console.log("User left");
  });
});

app.get("/rooms", async (req, res) => {
  return res.json(rooms);
});

app.get("/rooms/:roomname", async (req, res) => {
  let room =
    rooms[rooms.map((room) => room.roomname).indexOf(req.params.roomname)];
  return res.json(room);
});

app.post("/rooms", async (req, res) => {
  rooms.push(req.body);
  return res.json(req.body);
});

server.listen(PORT, () => {
  console.log(`Server runs on http://localhost:${PORT}`);
});
