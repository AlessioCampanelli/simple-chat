import express from "express";

import socketio from "socket.io";
import { UserSocket } from './UserSocket';

import * as config from './config/config';
import logger from './logger/chat-logger';

const app = express();
app.set("port", config.port || 10000);

let sockets: Array<UserSocket> = [];

const server = require("http").createServer(app);

let chatserver = socketio(server);

app.get("/", (req: any, res: any) => {
  res.send("Hello from chat server!");
});

// whenever a user connects on port 1000 via
// a websocket, log that a user has connected

chatserver.on('connection', (socket: UserSocket) => {

  sockets.push(socket);

  socket.on('message', (data: any) => {
    logger.info(`Received message ${data} from ${socket.id}`);
    broadcastSend(socket.id, data);
  });

  socket.on('disconnect', () => {
    logger.info(`User ${socket.id} disconnected`);
  });

  socket.on('error', function(error) {
    logger.error(`Socket ${socket.id} error ${error.message}`);
  });

});

function broadcastSend(from: string, msg: string) {

  if (sockets.length === 0) {
    logger.info('No sockets opened.');
    return;
  }

  console.log('FROM: ', from);

  sockets.forEach((socket, index, array) => {

    console.log('socket.id: ', socket.id);

    // if (socket.id === from) {
      socket.emit('message', msg);
    // }
  })
}

export default server;
