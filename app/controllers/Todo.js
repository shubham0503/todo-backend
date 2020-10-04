const db = require("../models");
const Todo = db.todo;
const User = db.user;

exports.todo = (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description,
    status: 0,
    createdAt: new Date,
    dueDate: req.body.dueDate
  });

  if (req.userId) {
    User.find({
        _id: {
          $in: req.userId
        }
      },
      (err, users) => {
        if (err) {
          res.status(500).send({
            message: err
          });
          return;
        }

        todo.user = users.map(user => user._id);
        todo.save(err => {
          if (err) {
            res.status(500).send({
              message: err
            });
            return;
          }

          res.status(200).send({
            message: "Todo created successfully!"
          });
        });
      }
    );
  }
};

exports.getTodo = (req, res) => {
  Todo.find({
    'user': req.userId
  }, (err, todo) => {
    if (err) {
      res.status(500).send({
        message: err
      });
      return;
    }
    res.status(200).send({
      message: "Todo list fetched successfully!",
      data: todo
    });
  });
};

exports.getTodoById = (req, res) => {
  Todo.findOne({
    '_id': req.params.id
  }, (err, todo) => {
    if (err) {
      res.status(500).send({
        message: err
      });
      return;
    }
    res.status(200).send({
      message: "Todo data fetched successfully!",
      data: todo
    });
  });
};

exports.updateTodo = (req, res) => {
  Todo.updateOne({
    '_id': req.body.todo
  }, {"status": 1}, (err, todo) => {
    if (err) {
      res.status(500).send({
        message: err
      });
      return;
    }
    res.status(200).send({
      message: "Todo data fetched successfully!",
      data: todo
    });
  });
};

exports.deleteTodo = (req, res) => {
  Todo.deleteOne({ _ide: req.params.id }, function (err) {
    if (err) {
      res.status(500).send({
        message: err
      });
    }
    res.status(200).send({
      message: "Todo data deleted successfully!"
    });
  });
}
