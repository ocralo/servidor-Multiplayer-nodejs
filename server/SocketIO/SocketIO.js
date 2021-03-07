exports = module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("conection", socket.client.id);
    //socket.emit("say_hi","hola bb")

    socket.on("prueba", function (data) {
      console.log(data);
    });

    socket.on("join_room", (room) => {
      socket.join(room);
    });

    socket.on("say to someone", (id, msg) => {
      socket.to(id).emit("my message", msg);
    });

    socket.on("user0", (data) => {
      console.log(data);
      io.volatile.emit(
        "user0",
        `${JSON.stringify(data).replace(/\"/g, "'").replace(/"/g, "")}`
      );
    });

    socket.on("user1", (data) => {
      console.log(data);
      io.volatile.emit(
        "user1",
        `${JSON.stringify(data).replace(/\"/g, "'").replace(/"/g, "")}`
      );
    });
  });
};
