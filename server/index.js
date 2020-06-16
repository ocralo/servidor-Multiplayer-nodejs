const net = require("net");
const connectedSockets = new Set();
const port = process.argv[2] || 9000;

// broadcast to all connected sockets except one
connectedSockets.broadcast = function (data, except) {
  console.log(this);
  for (let sock of this) {
    if (sock !== except) {
      sock.write(data);
    }
  }
};

const server = net.createServer((socket) => {
  connectedSockets.add(socket);
  socket.write("Echo server:\n"); //saludo

  socket.on("end", () => {
    connectedSockets.delete(socket);
  });

  socket.on("data", (data) => {
    //console.log(data.toString());
    connectedSockets.broadcast(data, socket);
    //socket.write(data); //eco de datos
  });
});

server.listen(port);
