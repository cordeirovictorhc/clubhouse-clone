import http from "http";
import { Server } from "socket.io";

export default class SocketServer {
  #io;

  constructor({ port }) {
    this.port = port;
  }

  async start() {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      });

      res.end("done.");
    });

    this.#io = new Server(server, {
      cors: {
        origin: "*",
        credentials: false,
      },
    });

    const room = this.#io.of("/room");

    room.on("connection", (socket) => {
      socket.emit("userConnection", `socket ${socket.id} se conectou`);

      socket.on("joinRoom", (dados) => {
        console.log("dados recebidos", dados);
      });
    });

    return new Promise((resolve, reject) => {
      server.on("error", reject);
      server.listen(this.port, () => resolve(server));
    });
  }
}
