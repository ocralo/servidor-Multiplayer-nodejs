//se llaman la librerias a utilizar
const express = require("express");

const app = express();

//se inicializa la aplicación
app.listen(3000, () => {
  console.log("server on port 3000");
});
