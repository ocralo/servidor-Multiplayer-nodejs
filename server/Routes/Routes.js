const express = require("express");
const router = express.Router();
const db = require("../Db/database");
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
// Generate Password bcrypt.
router.post("/bcrypt", (req, res) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      // Now we can store the password hash in db.
      res.send(hash);
    });
  });
});
/**
 * Endpoint for autentication
 *  */
router.post("/login", (req, resRequest) => {
  console.log(req.body);
  const body = req.body;
  const passwordRequest = body.password;
  const emailRequest = body.email;

  getUserDB(emailRequest, passwordRequest, resRequest);
});

const getUserDB = (correoRequest, passwordRequest, resRequest) => {
  SelectDb(`SELECT * FROM profesores WHERE correo_profesor="${correoRequest}"`)
    .then((resultado) => {
      console.log(resultado[0].nombre1_profesor);
      //////////////
      bcrypt.compare(passwordRequest, resultado[0].clave_profesor, function (
        err,
        res
      ) {
        if (res == true) {
          const payload = {
            check: true,
          };
          const token = jwt.sign(payload, configJwt.key, {
            expiresIn: 1440,
          });
          resRequest.json({
            message: "Autenticación correcta",
            auth: true,
            token: token,
          });
        } else {
          resRequest.json({
            message: "Usuario o contraseña incorrectos",
            auth: false,
          });
        }
      });
      ////////
    })
    .catch((err) => {
      resRequest.json({
        message: err,
        auth: false,
      });
    });
};

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
