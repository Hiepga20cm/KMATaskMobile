import { io, Socket } from "socket.io-client";
import { store } from "../store";
import { setConfig } from "../actions/loginQr";
import CryptoJS from "react-native-crypto-js";
interface ServerToClientEvents {
  "information-of-client-login": (data: any) => void;
  "status-login-qr-server-to-mobile": (data: any) => void;
}
interface ClientToServerEvents {
  sendDataLogin: (
    dataEncrypt: { message: string; receiverUserId: string },
    SocketId: string
  ) => void;
}
const encryptObject = (object: any, key: any) => {
  const plaintext = JSON.stringify(object);

  // Mã hóa văn bản rõ bằng AES với khóa đã cho
  const ciphertext = CryptoJS.AES.encrypt(plaintext, key).toString();
  console.log(ciphertext);
  return ciphertext;
};

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
  socket.on("status-login-qr-server-to-mobile", (data: any) => {
    console.log("status login qr : ", data);
    store.dispatch(setConfig(data) as any);
  });
};
const closeConnectWithServerAuth = () => {
  if (socket) {
    socket.disconnect();
    console.log("Disconnected from socket.io server.");
  }
};
const loginWithQrCode = (SocketId: any, data: any, key: any) => {
  data.socketId = SocketId;
  data.socketOrgId = socket.id;
  const dataEncrypt = encryptObject(data, key);
  socket.emit("sendDataLogin", dataEncrypt, SocketId);
};

export {
  connectWithSocketServerAuth,
  closeConnectWithServerAuth,
  loginWithQrCode,
};
