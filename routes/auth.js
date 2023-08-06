const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
// add server side validation

router.get("/signup", authController.getsignUp);

router.post(
  "/signup",
  [
    body("email", "Please enter a valid email").isEmail().normalizeEmail(),
    body("password", "Please enter a password of atleast 7 chars")
      .trim()
      .isLength({ min: 7 }),
    body("username", "Please enter a username of atleast 7 chars")
      .trim()
      .isLength({ min: 7 }),
  ],

  authController.signUp
);

module.exports = router;
