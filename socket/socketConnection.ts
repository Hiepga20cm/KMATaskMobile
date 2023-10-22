import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  "information-of-client-login": (data: any) => void;
}
interface ClientToServerEvents {
  sendDataTest: (data: { message: string; receiverUserId: string }) => void;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

const SERVER_URL = "http://192.168.0.164:5001";
const connectWithSocketServerAuth = () => {
  socket = io(SERVER_URL);
  socket.on("connect", () => {
    console.log(
      `Successfully connected to socket.io auth Server. Connected socket.id: ${socket.id}`
    );
  });
  socket.on("information-of-client-login", (data: any) => {
    console.log(data);
  });
};
const closeConnectWithServerAuth = () => {
  if (socket) {
    socket.disconnect();
    console.log("Disconnected from socket.io server.");
  }
};
const loginWithQrCode = (SocketId: any, data: any) => {
  console.log("userData ;", data);
  console.log("socketId : ", SocketId);
  data.socketId = SocketId;

  socket.emit("sendDataTest", data);
};

export {
  connectWithSocketServerAuth,
  closeConnectWithServerAuth,
  loginWithQrCode,
};
