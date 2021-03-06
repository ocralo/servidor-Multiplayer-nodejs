const express = require("express");
const protectedRoutes = express.Router();
const jwt = require("jsonwebtoken");

const configJwt = require("../Config/keyJWTConfig");

protectedRoutes.use((req, res, next) => {
  const inToken =
    req.headers["auth"] ||
    req.headers["authorization"] ||
    req.headers["Authorization"];

  console.log("token", inToken);

  const token = inToken ? inToken.replace("Bearer ", "") : "";

  if (token) {
    jwt.verify(token, configJwt.key, (err, decoded) => {
      if (err) {
        return res.json({ mensaje: "Token inválida" });
      } else {
        req.decoded = decoded;
        console.log("decode", decoded);
        next();
      }
    });
  } else {
    res.send({
      mensaje: "Token no enviado.",
      error: true,
    });
  }
});

module.exports = protectedRoutes;
