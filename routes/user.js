const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/:userId", userController.getUserDetails);

router.put("/:userId", userController.updateUserDetails);

router.post("/:userId/createTodo", userController.createUserTodo);

router.patch("/:userId/updateTodo", userController.updateUserTodo);

router.delete("/deleteTodo/:todoId", userController.deleteTodo);

router.get("/:userId/todos", userController.getUserTodos);

router.get("/:userId/futureTodos", userController.getFutureTodos);

module.exports = router;
