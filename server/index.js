const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

server.listen(7001, () => {
  console.log("server on port 7001");
});

app.get("/", function(req, res) {
  res.sendFile(
    "/Volumes/Macintosh HD/Escritorio/Trabajo de grado/Pruebas Unity/servidor-Multiplayer-nodejs/public/index.html"
  );
});

io.on("connection", function(socket) {
  console.log(socket.client.id);
  
  socket.on("user0", function(data) {
    //console.log(data);

    /* socket.emit(
      "user0",
      `${data.playerName},${data.position.x},${data.position.y},${data.position.z},${data.life},${data.id}`
    ); */
    io.emit(
      "user0",
      `${JSON.stringify(data)
        .replace(/\"/g, "'")
        .replace(/"/g, "")}`
    );
  });
  socket.on("user1", function(data) {
    console.log(data);
    /* socket.emit(
      "user1",
      `${data.playerName},${data.position.x},${data.position.y},${data.position.z},${data.life},${1}`
    ); */
    io.emit(
      "user1",
      `${JSON.stringify(data)
        .replace(/\"/g, "'")
        .replace(/"/g, "")}`
    );
  });
});
