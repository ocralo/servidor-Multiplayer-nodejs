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
router.post("/create", (req, res) => {
  const {
    nameStudent1,
    nameStudent2,
    lastNameStudent1,
    lastNameStudent2,
    emailStudent,
    passwordStudent,
    ageStudent,
    idGroup,
  } = req.body;

  if (
    !!!nameStudent1 &&
    !!!lastNameStudent1 &&
    !!!emailStudent &&
    !!!passwordStudent &&
    !!!ageStudent &&
    !!!idGroup
  ) {
    res.status(324).json({ message: "faltan datos por enviar", error: true });
  }

  BcryptPassword(passwordStudent)
    .then((password) => {
      SelectDb(
        `INSERT INTO estudiantes ( nombre1_estudiante, nombre2_estudiante, apellido1_estudiante, apellido2_estudiante, correo_estudiante, edad_estudiante, clave_estudiante, fk_grupo_id, fk_personaje_id) VALUES ('${nameStudent1}', '${
          !!nameStudent2 ? nameStudent2 : ""
        }', '${lastNameStudent1}', '${
          lastNameStudent2 ? lastNameStudent2 : ""
        }', '${emailStudent}', ${ageStudent}, '${password}', ${idGroup}, 1)`
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

const getUserDB = (emailRequest, passwordRequest, resRequest) => {
  SelectDb(
    `SELECT * FROM estudiantes WHERE correo_estudiante="${emailRequest}"`
  )
    .then((resultado) => {
      console.log(resultado[0]);
      //////////////
      bcrypt.compare(
        passwordRequest,
        resultado[0].clave_estudiante,
        function (err, res) {
          if (res == true) {
            const payload = {
              check: true,
              idPlayer: resultado[0].id_estudiante,
              student: true,
            };
            const token = jwt.sign(payload, configJwt.key, {
              expiresIn: 1440,
            });
            resRequest.json({
              message: "Autenticación correcta",
              auth: true,
              error: false,
              token: token,
            });
          } else {
            resRequest.json({
              message: "Usuario o contraseña incorrectos",
              error: true,
              auth: false,
            });
          }
        }
      );
      ////////
    })
    .catch((err) => {
      resRequest.json({
        message: "Usuario o contraseña incorrectos",
        error: true,
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
