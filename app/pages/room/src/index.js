import SocketBuilder from "../../_shared/socketBuilder.js";
import { constants } from "../../_shared/constants.js";

// sala individual
const socket = new SocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.room,
});

socket
  .setOnUserConnected(() => console.log("user connected.", user))
  .setOnUserDisconnected(() => console.log("user disconnected.", user))
  .build();

socket.emit(constants.events.JOIN_ROOM, { user, room });

const room = {
  id: Date.now(),
  topic: "JS Expert",
};

const user = {
  img: "https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_user2-256.png",
  username: "Victor Cordeiro",
};
