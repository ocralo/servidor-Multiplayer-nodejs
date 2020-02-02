const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

server.listen(7001, () => {
  console.log("server on port 7001");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "");
});

io.on("connection", function(socket) {
  setInterval(() => socket.emit("news", `${new Date()}`), 1000);
  socket.emit("news", { hello: "world" });
  socket.on("my other event", function(data) {
    console.log(data);
  });
});
