import "socket.io-client";

class SocketIOClientWrapper {
  static onevent(socket) {
    return socket.onevent;
  }
  static setOnevent(socket, func) {
    socket.onevent = func;
  }
}
export default SocketIOClientWrapper;