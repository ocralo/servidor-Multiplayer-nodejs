const express = require("express");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);
const ioFile = require("./SocketIO/SocketIO")(io);

const multer = require("multer");
const upload = multer();

const routes = require("./Routes/Routes");
const user = require("./Routes/user");
const game = require("./Routes/game");
const grups = require("./Routes/groups");
const grades = require("./Routes/grades");
const teachers = require("./Routes/teachers");
const institutions = require("./Routes/institutions");

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

//routes
app.use("/", routes);
app.use("/user", user);
app.use("/game", game);
app.use("/groups", grups);
app.use("/grades", grades);
app.use("/teachers", teachers);
app.use("/institutions", institutions);

//app.use(bodyParser.json());

//app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

server.listen(7001, () => {
  console.log("server on port 7001");
  console.log(__dirname);
});

//app.get("/", express.static(__dirname + "/public/index.html"));
