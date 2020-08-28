const express = require("express");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

const multer = require("multer");
const upload = multer();

const routes = require("./Routes/Routes");
const bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(express.static("files"));

/* app.set("key", configJwt.key);
app.set("keyPassword", configBcrypt.key); */
app.use(express.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(upload.array());

app.use("/", routes);

//app.use(bodyParser.json());

//app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

server.listen(7001, () => {
  console.log("server on port 7001");
  console.log(__dirname);
});

//app.get("/", express.static(__dirname + "/public/index.html"));

io.on("connection", function (socket) {
  console.log(socket.client.id);

  socket.on("user0", function (data) {
    io.volatile.emit(
      "user0",
      `${JSON.stringify(data).replace(/\"/g, "'").replace(/"/g, "")}`
    );
  });

  socket.on("user1", function (data) {
    io.volatile.emit(
      "user1",
      `${JSON.stringify(data).replace(/\"/g, "'").replace(/"/g, "")}`
    );
  });
});
