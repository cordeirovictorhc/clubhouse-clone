import SocketServer from "./util/socket.js";
import RoomsController from "./controllers/rooms-controller.js";
import { constants } from "./util/constants.js";
import Event from "events";

const port = process.env.PORT || 3000;

(async () => {
  const socketServer = new SocketServer({ port });
  const server = await socketServer.start();

  const roomsController = new RoomsController();

  const namespaces = {
    room: { controller: roomsController, eventEmitter: new Event() },
  };

  /*

  namespaces.room.eventEmitter.on(
    "userConnected",
    namespaces.room.controller.onNewConnection.bind(namespaces.room.controller)
  );

  namespaces.room.eventEmitter.emit("userConnected", { id: "001" }); 
  
  */

  const routeConfig = Object.entries(namespaces).map(
    ([namespace, { controller, eventEmitter }]) => {
      const controllerEvents = controller.getEvents();

      eventEmitter.on(
        constants.events.USER_CONNECTED, // on new connection...
        controller.onNewConnection.bind(controller)
      );

      return {
        [namespace]: { events: controllerEvents, eventEmitter },
      };
    }
  );

  /* 
  
  [
    {
      room: {
        events: Map {
          'onNewConnection' => this.onNewConnection,
          'getEvents' => this.getEvents
        },
        eventEmitter: EventEmitter {
          _events: [Object: null prototype] {
            userConnection: this.onNewConnection
          },
          _eventsCount: 1,
          _maxListeners: undefined,
          [Symbol(kCapture)]: false
        }
      }
    }
  ] 
  
  */

  socketServer.attachEvents({ routeConfig });

  console.log(`socket server is running at port ${server.address().port}`);
})();
