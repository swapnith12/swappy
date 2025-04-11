import { io } from "socket.io-client";

const socket = io("http://localhost:4000",{transports: ["websocket"],}); // Backend URL
export default socket;
