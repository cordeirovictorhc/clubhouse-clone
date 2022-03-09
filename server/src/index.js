import SocketServer from "./util/socket.js";

const port = process.env.PORT || 3000;

(async () => {
  const socketServer = new SocketServer({ port });
  const server = await socketServer.start();

  console.log(`socket server is running at port ${server.address().port}`);
})();
