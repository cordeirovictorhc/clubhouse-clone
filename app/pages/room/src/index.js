import { constants } from "../../_shared/constants.js";
import RoomSocketBuilder from "./util/room-socket.js";

const room = {
  id: "0001",
  topic: "JS Expert",
};

const user = {
  img: "https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_user2-256.png",
  username: `Victor ${Date.now()}`,
};

const socketBuilder = new RoomSocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.room,
});

const socket = socketBuilder
  .setOnUserConnected((user) => {})
  .setOnUserDisconnected((user) => {})
  .setOnRoomUpdated((room) => console.log("room", room))
  .build();

socket.emit(constants.events.JOIN_ROOM, { user, room });
