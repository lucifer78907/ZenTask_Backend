const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    percCompleted: {
      type: Number,
      default: 0,
    },
    priority: {
      type: Number,
      default: 1,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    creator:{
      id:{
        type:Schema.Types.ObjectId,
        ref:'User',
      },
    }
  },
  { timestamps: true } //created and updated at
);

module.exports = mongoose.model('Todo',TodoSchema)