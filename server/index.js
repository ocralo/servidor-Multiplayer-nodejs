const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

server.listen(7001, () => {
  console.log("server on port 7001");
});

app.get("/", function(req, res) {
  res.sendFile("../public/");
});

io.on("connection", function(socket) {
  console.log(socket.client.id);
  socket.on("user0", function(data) {
    //console.log(data);
    socket.emit("user0", `${JSON.stringify(data)}`);
  });
  socket.on("user1", function(data) {
    //console.log(data);
    socket.emit("user1", `${JSON.stringify(data)}`);
  });
});
