const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const helper = require("../helper/randomNumberGen");
const jwt = require("jsonwebtoken");

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
    const randomNum = helper.randomNumberGen(5);
    const imageUrl = `images/profile-${randomNum}.jpg`; //default img for a new user

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
      imageUrl,
    });

    console.log(user);

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

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    // check if email doesn't exists then throw an error
    let user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User doesn't exists");
      error.statusCode = 404;
      throw error;
    }
    // compare pass if exists
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong Password");
      error.statusCode = 401;
      throw error;
    }
    // Creating the token
    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process.env.PRIVATE_KEY, //secret key
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Successfully logged in",
      status: 200,
      userId: user._id.toString(),
      token: token,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
