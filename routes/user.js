const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/:userId", userController.getUserDetails);

router.post("/:userId/createTodo",userController.createUserTodo)

router.patch("/:userId/updateTodo",userController.updateUserTodo)

router.get("/:userId/todos",userController.getUserTodos)

module.exports = router;
