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
  //INSERT INTO `estudiantes` (, `nombre1_estudiante`, `nombre2_estudiante`, `apellido1_estudiante`, `apellido2_estudiante`, `correo_estudiante`, `edad_estudiante`, `clave_estudiante`, `fk_grupo_id`, `fk_personaje_id`) VALUES (NULL, '', NULL, '', NULL, '', '', '', '', '')
  const { name1 } = req.body;

  SelectDb(`SELECT id_grupo,nombre_grupo FROM grupos`)
    .then((result) => {
      console.log(result);
      res.status(200).json({ groups: result, error: false });
    })
    .catch((err) => {
      res.status(500).json({ message: err, error: true });
    });
});

router.post("/create", (req, res) => {
  //INSERT INTO `estudiantes` (, `nombre1_estudiante`, `nombre2_estudiante`, `apellido1_estudiante`, `apellido2_estudiante`, `correo_estudiante`, `edad_estudiante`, `clave_estudiante`, `fk_grupo_id`, `fk_personaje_id`) VALUES (NULL, '', NULL, '', NULL, '', '', '', '', '')
  const { nameGroup, idTeacher, idGrade } = req.body;

  if (!!!nameGroup && !!!idTeacher && !!!idGrade) {
    res.status(324).json({ message: "faltan datos por enviar", error: true });
  }

  SelectDb(
    `INSERT INTO grupos ( nombre_grupo, fk_profesor_id, fk_grado_id) VALUES ( '${nameGroup}', ${idTeacher}, ${idGrade})`
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
