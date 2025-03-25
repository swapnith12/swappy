import type { Server as HTTPServer } from "http"
import type { Socket as NetSocket } from "net"
import type { NextApiRequest, NextApiResponse } from "next"
import type { Server as IOServer } from "socket.io"
import { Server } from "socket.io"


interface SocketServer extends HTTPServer {
    io?: IOServer | undefined
  }
  
  interface SocketWithIO extends NetSocket {
    server: SocketServer
  }
  
  interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO
  }
  

export default function handler(_req: NextApiRequest, res: NextApiResponseWithSocket) {
    if (!res.socket?.server?.io) {
        const io = new Server(res.socket.server, {
            path: "/api/socket",
            cors: { origin: "*" },
        });

        io.on("connection", (socket) => {
            console.log("A user connected", socket.id);

            socket.on("create-room", (roomId) => {
                socket.join(roomId);
                console.log(`User ${socket.id} created room ${roomId}`);
            });

            socket.on("join-room", (roomId) => {
                socket.join(roomId);
                console.log(`User ${socket.id} joined room ${roomId}`);
            });

            socket.on("chat-message", ({ roomId, message }) => {
                io.to(roomId).emit("chat-message", message);
            });

            socket.on("disconnect", () => {
                console.log("A user disconnected", socket.id);
            });
        });
        (global as any).io = io
        res.socket.server.io = io;
    }
    res.end();
}
