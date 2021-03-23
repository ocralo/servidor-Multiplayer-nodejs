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
router.get("/", (req, res) => {
  SelectDb(`SELECT id_institucion, nombre_institucion FROM instituciones`)
    .then((result) => {
      console.log(result);
      res.status(200).json({ groups: result, error: false });
    })
    .catch((err) => {
      res.status(500).json({ message: err, error: true });
    });
});

router.post("/create", (req, res) => {
  const { nameInstitution } = req.body;

  if (!!!nameInstitution) {
    res.status(324).json({ message: "faltan datos por enviar", error: true });
  }

  SelectDb(
    `INSERT INTO instituciones (nombre_institucion) VALUES ('${nameInstitution}')`
  )
    .then((result) => {
      console.log(result);
      res.status(200).json({ groups: result, error: false });
    })
    .catch((err) => {
      res.status(500).json({ message: err, error: true });
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
        console.log("error coneccion DB");
        reject("error con la conexion en la DB");
      }
    });
  });
};

module.exports = router;
