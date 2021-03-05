const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const protectedRoutes = require("./ProtectedRoutes");

// About page route.
router.get("/about", protectedRoutes, (req, res) => {
  res.send("About this wiki");
});

router.get("/about", (req, res) => {
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

module.exports = router;
