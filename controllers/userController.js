const Todo = require("../models/Todo");
const User = require("../models/User");
const helper = require("../helper/checkDate");
const bcrypt = require("bcryptjs");

exports.getUserDetails = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    let user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw err;
    }
    user = {
      userId: user._id,
      email: user.email,
      username: user.username,
      userImage: user.imageUrl,
    };
    res
      .status(200)
      .json({ message: "Successfully fetched User details", user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUserDetails = async (req, res, next) => {
  // add image deletion
  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }
  const userId = req.params.userId;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const file = req.file.path;

  try {
    // Compare both the fields first
    if (password !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 401;
      throw error;
    }

    // hash the new password and save
    const hashedPassword = await bcrypt.hash(password, 12);

    let user = await User.findByIdAndUpdate(userId, {
      $set: {
        username: username,
        email: email,
        imageUrl: file,
        password: hashedPassword,
      },
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Update User details",
      user: { ...user, password: "Hidden" },
      status: 200,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserTodos = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    let user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw err;
    }
    // Find all todos of user
    let { todos } = await User.findById(userId).populate("todos");
    let allTodos = todos.map((t) => {
      return {
        id: t._id,
        title: t.title,
        description: t.description,
        progress: t.percCompleted,
        priority: t.priority,
        dueDate: t.dueDate,
      };
    });
    res.status(200).json({
      message: "Successfully fetched todos",
      todos: allTodos,
      status: 200,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getFutureTodos = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    let user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw err;
    }
    // Find all todos of user
    let { futureTodos } = await User.findById(userId).populate("futureTodos");
    let allTodos = futureTodos.map((t) => {
      return {
        id: t._id,
        title: t.title,
        description: t.description,
        progress: t.percCompleted,
        priority: t.priority,
        dueDate: t.dueDate,
      };
    });
    res.status(200).json({
      message: "Successfully fetched todos",
      todos: allTodos,
      status: 200,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createUserTodo = async (req, res, next) => {
  const userId = req.params.userId;
  const body = req.body;
  const date = new Date(body.date);
  const currDate = new Date();
  const time = helper.getDate(currDate, date);

  const todoObj = {
    title: body.title,
    description: body.desc,
    percCompleted: 0,
    priority: body.priority,
    dueDate: new Date(body.date),
    creator: {
      id: userId,
    },
  };

  // find the user
  try {
    let user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw err;
    }
    // user if found , add the todo
    let creator = user;
    const todo = new Todo(todoObj);
    const result = await todo.save();
    if (time === "Today" || time === "Tomorrow") creator.todos.push(todo);
    else creator.futureTodos.push(todo);
    const end = await creator.save();

    res.status(201).json({
      message: "Todo created",
      todo: todoObj,
      creator: { _id: creator._id, name: creator.username },
      status: 201,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUserTodo = async (req, res, next) => {
  const userId = req.params.userId;
  const body = req.body;
  const currDate = new Date();

  const todoObj = {
    title: body.title,
    description: body.desc,
    percCompleted: 0,
    priority: body.priority,
    dueDate: body.date,
  };

  // find the todo
  try {
    // todo if found , update the todo
    const time = helper.getDate(currDate, new Date(body.date));
    let todo = await Todo.findByIdAndUpdate(body.id, todoObj, { new: true });
    if (!todo) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw err;
    }
    // update the user todo and future todo list
    let user = await User.findById(userId);
    // filter the future and curr todo list
    let newTodos = user.todos.filter((t) => t._id.toString() !== body.id);
    let newFutureTodos = user.futureTodos.filter(
      (t) => t._id.toString() !== body.id
    );

    user.todos = newTodos;
    user.futureTodos = newFutureTodos;
    // check which todolist to fill now
    if (time === "Today" || time === "Tomorrow") user.todos.push(todo);
    else user.futureTodos.push(todo);

    await user.save();

    res.status(201).json({
      message: "updated todo",
      todo: todo,
      userId: userId,
      status: 200,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// REMOVE TODO FROM USERS TOO

exports.deleteTodo = async (req, res, next) => {
  const todoId = req.params.todoId;

  try {
    let todo = await Todo.findByIdAndDelete(todoId);
    if (!todo) {
      const error = new Error("Todo not found");
      error.statusCode = 404;
      throw err;
    }

    res
      .status(201)
      .json({ message: "Deleted todo", status: 200, deleted: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
