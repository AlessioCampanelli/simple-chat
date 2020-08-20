import socketio from "socket.io";

export interface UserSocket extends socketio.Socket {
	username?: string;
}