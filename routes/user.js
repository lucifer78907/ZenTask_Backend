const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const isAuth = require("../middleware/is-auth"); //checks for authentication

router.get("/:userId", isAuth, userController.getUserDetails);

router.put("/:userId", isAuth, userController.updateUserDetails);

router.post("/:userId/createTodo", isAuth, userController.createUserTodo);

router.patch("/:userId/updateTodo", isAuth, userController.updateUserTodo);

router.delete("/deleteTodo/:todoId", isAuth, userController.deleteTodo);

router.get("/:userId/todos", isAuth, userController.getUserTodos);

router.get("/:userId/futureTodos", isAuth, userController.getFutureTodos);

module.exports = router;
