import express from "express";

import socketio, { Socket } from "socket.io";
import http from 'http';

import * as config from './config/config';
import logger from './logger/chat-logger';

const app = express();
app.set("port", config.port || 10000);

// List of connected sockets
let sockets: Socket[] = [];

const server = http.createServer(app);

// Create bidirectional and event-based communication Server
let chatserver = socketio(server);

chatserver.on('connection', (socket: Socket) => {

  addSocket(socket);

  socket.on('message', (data: any) => {
    logger.info(`Received message ${data} from ${socket.id}`);
    broadcastSend(data.toString());
  });

  socket.on('disconnect', () => {
    removeSocket(socket);
  });

  socket.on('error', function(error) {
    logger.error(`Socket ${socket.id} error ${error.message}`);
  });
});

/**
 * Send message from socket to all connected clients
 * @param from represents socket id
 * @param msg message to sent all
 */
function broadcastSend(msg: string) {

  if (sockets.length === 0) {
    logger.info('No sockets opened.');
    return;
  }

  sockets.forEach((socket) => {  
    socket.emit('message', msg);
  });
}

/**
 * add Socket to DB (array in this simple case)
 * @param socket 
 */
function addSocket(socket:Socket) {
  logger.info(`User ${socket.id} connected`);
  sockets.push(socket);
}

/**
 * remove socket from DB (array in this simple case)
 * @param socket 
 */
function removeSocket(socket:Socket) {
  const index = sockets.findIndex(item => item.id)
  if (index > -1) {
    logger.info(`User ${socket.id} disconnected and remove from DB, index: ${index}`);
    sockets.splice(index, 1);
  }
};

function getSockets(): Socket[]{
  return sockets;
}

export default server;
export { getSockets as listSockets }
