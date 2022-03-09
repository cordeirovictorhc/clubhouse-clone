import SocketBuilder from "../../_shared/socket-builder.js";
import { constants } from "../../_shared/constants.js";

const room = {
  id: Date.now(),
  topic: "JS Expert",
};

const user = {
  img: "https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_user2-256.png",
  username: "Victor Cordeiro",
};

const socketBuilder = new SocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.room,
});

const socket = socketBuilder
  .setOnUserConnected((user) => console.log("user connected:", user))
  .setOnUserDisconnected((user) => console.log("user disconnected.", user))
  .build();

socket.emit(constants.events.JOIN_ROOM, { user, room });
