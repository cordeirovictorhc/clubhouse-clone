import { constants } from "../util/constants.js";

export default class RoomsController {
  constructor() {}

  onNewConnection(socket) {
    const { id } = socket;
    console.log(`connected with ${id}`);
  }

  joinRoom(socket, data) {
    console.log("dados recebidos", data);
    socket.emit(constants.events.USER_CONNECTED, data);
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
