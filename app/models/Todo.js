const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define schema for todo items
const todoSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  status: {
    type: String
  },
  createdAt: {
    type: String
  },
  dueDate: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
