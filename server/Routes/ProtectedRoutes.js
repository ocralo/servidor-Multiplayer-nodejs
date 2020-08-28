const express = require("express");
const protectedRoutes = express.Router();
const jwt = require("jsonwebtoken");

protectedRoutes.use((req, res, next) => {
  const token =
    req.headers["auth"] || req.headers["authorization"].replace("Bearer ", "");

  if (token) {
    jwt.verify(token, app.get("key"), (err, decoded) => {
      if (err) {
        return res.json({ mensaje: "Token inválida" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.send({
      mensaje: "Token no proveída.",
    });
  }
});

module.exports = protectedRoutes;
