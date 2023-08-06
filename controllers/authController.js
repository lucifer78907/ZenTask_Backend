const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.signUp = async (req, res, next) => {
  // check for errors

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    let user = await User.findOne({ email: email });
    if (user) {
      //user was found
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    user = new User({
      email,
      username,
      password: hashedPassword,
    });

    const response = await user.save();
    res.status(201).json({
      message: "User created in database",
      userId: response._id,
      status: 201,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getsignUp = (req, res, next) => {
  res.send("This signup works");
};
