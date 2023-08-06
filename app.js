const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();

app.use(bodyParser.json()); //to parse the json data we are gonna use in our application

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //star means any
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode;
  const message = error.message;
  const data = error.data ?? "Server error";
  res.status(status).json({ message, status, data });
});

mongoose
  .connect(
    "mongodb+srv://Rudra:Hanuman%407@cluster0.mtjcxyj.mongodb.net/todo?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connection established");
    app.listen(8080);
  })
  .catch((err) => console.log(err));
