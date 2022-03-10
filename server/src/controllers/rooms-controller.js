import { constants } from "../util/constants.js";
import Attendee from "../entities/attendee.js";
import Room from "../entities/room.js";

export default class RoomsController {
  #users = new Map(); // banco de dados in memory

  constructor() {
    this.rooms = new Map();
  }

  onNewConnection(socket) {
    const { id } = socket;
    console.log(`connected with ${id}`);

    this.#updateGlobalUserData(id);
  }

  joinRoom(socket, { user, room }) {
    const userId = (user.id = socket.id);
    const roomId = room.id;

    const updatedUserData = this.#updateGlobalUserData(userId, user, roomId);

    const updatedRoom = this.#joinUserRoom(socket, updatedUserData, room);

    console.log({ updatedRoom });

    socket.emit(constants.events.USER_CONNECTED, updatedUserData);
  }

  #joinUserRoom(socket, user, room) {
    const roomId = room.id;
    const existingRoom = this.rooms.has(roomId);

    const currentRoom = existingRoom ? this.rooms.get(roomId) : {};
    const currentUser = new Attendee({
      ...user,
      roomId,
    });

    // definir quem é o dono da sala
    const [owner, users] = existingRoom
      ? [currentRoom.owner, currentRoom.users]
      : [currentUser, new Set()];

    const updatedRoom = this.#mapRoom({
      ...currentRoom,
      ...room,
      owner,
      users: new Set([...users, ...[currentUser]]),
    });

    this.rooms.set(roomId, updatedRoom);

    socket.join(roomId);

    return this.rooms.get(roomId);
  }

  #mapRoom(room) {
    const users = [...room.users.values()];
    const speakersCount = users.filter((user) => user.isSpeaker).length;
    const featuredAttendees = users.slice(0, 3);

    const mappedRoom = new Room({
      ...room,
      speakersCount,
      featuredAttendees,
      attendeesCount: room.users.size,
    });

    return mappedRoom;
  }

  #updateGlobalUserData(userId, userData = {}, roomId = "") {
    const user = this.#users.get(userId) ?? {};
    const existingRoom = this.rooms.has(roomId);

    const updatedUserData = new Attendee({
      ...user,
      ...userData,
      roomId,
      // se for o único na sala, ou seja, usuário é o primeiro participante
      isSpeaker: !existingRoom,
    });

    this.#users.set(userId, updatedUserData);

    return this.#users.get(userId);
  }

  getEvents() {
    // retorna um array com os nomes de cada função pública da classe
    const functions = Reflect.ownKeys(RoomsController.prototype)
      .filter((fnName) => fnName !== "constructor")
      .map((fnName) => [fnName, this[fnName].bind(this)]);

    /* 

    functions:

    [
      [ 'onNewConnection', this.onNewConnection ],
      [ 'getEvents', this.getEvents ]
    ]
    
    */

    return new Map(functions);

    /*

    Map {
      'onNewConnection' => this.onNewConnection,
      'getEvents' => this.getEvents
    }

    */
  }
}
