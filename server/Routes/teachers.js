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
  SelectDb(
    `SELECT id_profesor,nombre1_profesor,nombre2_profesor,apellido1_profesor,apellido2_profesor FROM profesores`
  )
    .then((result) => {
      console.log(result);
      res.status(200).json({ groups: result, error: false });
    })
    .catch((err) => {
      res.status(500).json({ message: err, error: true });
    });
});

router.post("/create", (req, res) => {
  const {
    nameTeacher1,
    nameTeacher2,
    lastNameTeacher1,
    lastNameTeacher2,
    emailTeacher,
    passwordTeacher,
  } = req.body;

  if (
    !!!nameTeacher1 &&
    !!!lastNameTeacher1 &&
    !!!emailTeacher &&
    !!!passwordTeacher
  ) {
    res.status(324).json({ message: "faltan datos por enviar", error: true });
  }

  BcryptPassword(passwordTeacher)
    .then((password) => {
      SelectDb(
        `INSERT INTO profesores ( nombre1_profesor, nombre2_profesor, apellido1_profesor, apellido2_profesor, correo_profesor, clave_profesor) VALUES ('${nameTeacher1}', '${
          nameTeacher2 ? nameTeacher2 : ""
        }', '${lastNameTeacher1}', '${
          lastNameTeacher2 ? lastNameTeacher2 : ""
        }', '${emailTeacher}', '${password}')`
      )
        .then((result) => {
          console.log(result);
          res.status(200).json({ groups: result, error: false });
        })
        .catch((err) => {
          res.status(500).json({ message: err, error: true });
        });
    })
    .catch((errBcrypt) => {
      res.status(500).json({ message: errBcrypt, error: true });
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

const BcryptPassword = (password) => {
  return new Promise((accep, reject) => {
    bcrypt.genSalt(saltRounds, async (err1, salt) => {
      bcrypt.hash(password, salt, (err2, hash) => {
        // Now we can store the password hash in db.
        accep(hash);
      });
    });
  });
};

module.exports = router;
