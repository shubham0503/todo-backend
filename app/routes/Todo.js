const { authJwt } = require("../middlewares");
const todoController = require("../controllers/Todo");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/todo", [authJwt.verifyToken], todoController.todo);
  app.get("/api/todo", [authJwt.verifyToken], todoController.getTodo);
  app.get("/api/todo/:id", [authJwt.verifyToken], todoController.getTodoById);
  app.patch("/api/todo/:id", [authJwt.verifyToken], todoController.updateTodo);
  app.delete("/api/todo/:id", [authJwt.verifyToken], todoController.deleteTodo);
};
