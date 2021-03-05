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
// About page route.
router.post("/create", protectedRoutes, async (req, res) => {
  // INSERT INTO partidas (id_partida, nombre_partida, clave_partida, num_jugadores_partida, estado_partida) VALUES ('', '', '', '', '')
  console.log(req.body);
  let { name, password } = req.body;

  if (!!!name || !!!password) {
    res.json({
      message: "Faltan datos por enviar",
      party: false,
    });
    return;
  }

  const num = Math.floor(1000 + Math.random() * 9000);

  name += `${num}`;

  BcryptPassword(password)
    .then((result) => {
      SelectDb(
        `INSERT INTO partidas (nombre_partida, clave_partida, num_jugadores_partida, estado_partida) VALUES ('${name}', '${result}', 2, 1)`
      )
        .then((result) => {
          console.log(result);
          res.json({
            message: "err",
            party: true,
          });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            message: err,
            party: false,
          });
        });
    })
    .catch((err) => {
      res.json({
        message: err,
        party: false,
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
