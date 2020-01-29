//se llaman la librerias a utilizar
const http = require("http");
const express = require("express");
var WebSocket = require("ws");

//se inicializa express y demas
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

//se inicializa la aplicación y se le asigna el puerto
server.listen(3000, () => {
  console.log("server on port 3000");
});

//use ws
wss.on("connection", function(ws) {
  ws.on("message", function(message) {
    console.log("received: %s", message);
  });

  setInterval(() => ws.send(`${new Date()}`), 1000);
});

//static file
app.use(express.static("public"));
