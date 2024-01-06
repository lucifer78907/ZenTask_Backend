const env = require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");

const app = express();

app.use(cors());

const fileStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(10, (error, buffer) => {
      if (error) throw error;
      const parts = file.originalname.split(".");
      const extension = parts[parts.length - 1];
      const filename = buffer.toString("hex") + "." + extension;
      cb(null, filename);
    });
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ["image/jpg", "image/jpeg", "image/png"];
  if (allowedExtensions.includes(file.mimetype)) {
    cb(null, true);
  } else {
    return cb(null, false);
  }
};

app.use(bodyParser.json()); //to parse the json data we are gonna use in our application
app.use("/images", express.static(path.join(__dirname, "images"))); //statically serve the images
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// app.options('*', (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust origin based on your needs
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//   next();
// });

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*"); //star means any
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
//   next();
// });

app.use("/user", userRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode;
  const message = error.message;
  const data = error.data ?? "Server error";
  res.status(status).json({ message, status, data });
});

mongoose
  .connect(process.env.MONGODB_KEY)
  .then(() => {
    console.log("Connection established");
    app.listen(8080);
  })
  .catch((err) => console.log(err));
