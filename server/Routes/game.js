const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const configJwt = require("../Config/keyJWTConfig");

// Load the MySQL pool connection
const pool = require("../Db/database");
const protectedRoutes = require("./ProtectedRoutes");

// About page route.
router.get("/about", protectedRoutes, (req, res) => {
  res.send("About this wiki");
});

//Assignate Points
router.post("/points", protectedRoutes, async (req, res) => {
  // INSERT INTO Puntuaciones ( fk_estudiante_id, fk_partida_id, puntuacion) VALUES (NULL, '', '', '')
  console.log(req.body);
  console.log("req.decoded", req.decoded);
  const { idPlayer: idStudent } = req.decoded;
  let { gameId, point } = req.body;
  if (!gameId || !point) {
    if (!Number.isNaN(gameId) || !Number.isNaN(point)) {
      res.json({
        message: "Los datos deben ser numeros",
        error: true,
      });
      return;
    }
    res.json({
      message: "Faltan datos por enviar",
      error: true,
    });
    return;
  }

  SelectDb(
    `INSERT INTO Puntuaciones ( fk_estudiante_id, fk_partida_id, puntuacion) VALUES (${idStudent}, ${gameId}, ${point})`
  )
    .then((result) => {
      res.json({
        message: "Partida creada",
        id: result.insertId,
        error: false,
      });
    })
    .catch((err) => {
      res.json({
        message: "Partida creada",
        id: result.insertId,
        error: true,
      });
    });
});

// Create Game.
router.post("/create", protectedRoutes, async (req, res) => {
  // INSERT INTO partidas (id_partida, nombre_partida, clave_partida, num_jugadores_partida, estado_partida) VALUES ('', '', '', '', '')
  console.log(req.body);
  let { name, password, level = 1 } = req.body;

  if (!!!name || !!!password) {
    res.json({
      message: "Faltan datos por enviar",
      error: true,
    });
    return;
  }

  const num = Math.floor(1000 + Math.random() * 9000);

  name += `${num}`;

  BcryptPassword(password)
    .then((result) => {
      // INSERT INTO 'partidas' ('id_partida', 'nombre_partida', 'clave_partida', 'num_jugadores_partida', 'estado_partida', 'puntuacion_total_partidas', 'fk_niveles_id') VALUES (NULL, '', '', '', '', NULL, '')
      SelectDb(
        `INSERT INTO partidas (nombre_partida, clave_partida, num_jugadores_partida, estado_partida, fk_niveles_id) VALUES ('${name}', '${result}', 2, 1, ${level})`
      )
        .then((result) => {
          console.log(result);
          res.json({
            message: "Partida creada",
            idGame: result.insertId,
            error: false,
          });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            message: err,
            error: true,
          });
        });
    })
    .catch((err) => {
      res.json({
        message: err,
        error: true,
      });
    });
});

const SelectDb = (sqlSelect) => {
  return new Promise((accep, reject) => {
    pool.query(sqlSelect, function (error, rows, field) {
      if (!error) {
        if (!!error) {
          console.log("error en el query");
          reject("error en el query");
        } else {
          accep(rows);
        }
      } else {
        console.log("error coneccion DB - " + error);
        reject("error con la conexion en la DB");
      }
    });
  });
};

const BcryptPassword = (password) => {
  return new Promise((accep, reject) => {
    bcrypt.genSalt(saltRounds, async (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        // Now we can store the password hash in db.
        accep(hash);
      });
    });
  });
};

module.exports = router;
