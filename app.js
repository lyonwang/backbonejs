// load modules
var db = require('./db.js');  // open connection to mongodb
var routes = require('./routes');
var express = require('express');

// get app
app = express();

// configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Routes
app.get("/", routes.index);
app.get("/todos", routes.todos_read);
app.post("/todos", routes.todos_create);
app.put("/todos/:id", routes.todos_update);
app.del('/todos/:id', routes.todos_delete);

// Listen
app.listen(3003);