var mongoose = require('mongoose');
var Todo = mongoose.model('Todo');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.todos_create = function(req, res) {
  var todo;
  todo = new Todo({
    content: req.body.content,
    done: req.body.done
  });
  todo.save(function(err) {
    if (!err) {
      return console.log("created");
    }
  });
  return res.send(todo);
};

exports.todos_read = function(req, res) {
  return Todo.find(function(err, todos) {
                    return res.send(todos);
                  });
};

exports.todos_update = function(req, res) {
  return Todo.findById(req.params.id, function(err, todo) {
    todo.content = req.body.content;
    todo.done = req.body.done;
    return todo.save(function(err) {
      if (!err) {
        console.log("updated");
      }
      return res.send(todo);
    });
  });
};

exports.todos_delete = function(req, res) {
  return Todo.findById(req.params.id, function(err, todo) {
    return todo.remove(function(err) {
      if (!err) {
        return console.log("removed");
      }
    });
  });
};