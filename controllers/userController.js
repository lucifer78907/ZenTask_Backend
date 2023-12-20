const Todo = require("../models/Todo");
const User = require("../models/User");

exports.getUserDetails = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    let user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw err;
    }
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

exports.getUserTodos = async(req,res,next) => {
  const userId = req.params.userId;
  console.log(userId);

  try {
      let user = await User.findById(userId);
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw err;
      }
      // Find all todos of user
      let {todos} = await User.findById(userId).populate('todos');
      let allTodos = todos.map(t => {
        return {
          id:t._id,
          title:t.title,
          description:t.description,
          progress:t.percCompleted,
          priority:t.priority,
        }
      })
      console.log(allTodos);
      res.status(200).json({message:'Successfully fetched todos',todos:allTodos,status:200});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
}

exports.createUserTodo = async (req,res,next) => {
  const userId = req.params.userId;
  const body = req.body;

  const todoObj = {
    title:body.title,
    description:body.desc,
    percCompleted:0,
    priority:body.priority,
    dueDate:new Date(body.date),
    creator:{
      id:userId,
    }
  }

  // find the user
   try {
    let user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw err;
    }
    // user if found , add the todo 
    let creator=user;
    const todo = new Todo(todoObj);
    const result = await todo.save();
    creator.todos.push(todo);
    const end  = await creator.save();

    res.status(201).json({message:'Todo created',todo:todoObj,creator:{_id:creator._id,name:creator.username},status:201})
    
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  
}

exports.updateUserTodo = async (req,res,next) => {
  const userId = req.params.userId;
  const body = req.body;

  const todoObj = {
    title:body.title,
    description:body.desc,
    percCompleted:0,
    priority:body.priority,
  }

  console.log(todoObj)

  // find the todo
   try {
    let todo = await Todo.findByIdAndUpdate(body.id,todoObj,{new:true})
    if (!todo) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw err;
    }
    // todo if found , update the todo

    res.status(201).json({message:'updated todo',todo:todo,userId:userId,status:200})
    
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  
}

// REMOVE TODO FROM USERS TOO

exports.deleteTodo = async(req,res,next) => {
  const todoId = req.params.todoId;

  try {
      let todo = await Todo.findByIdAndDelete(todoId);
      if (!todo) {
        const error = new Error("Todo not found");
        error.statusCode = 404;
        throw err;
      }

      res.status(201).json({message:'Deleted todo',status:200,deleted:true})
      
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
}