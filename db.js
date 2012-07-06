var mongoose = require('mongoose');

mongoose.model('Todo', new mongoose.Schema({
  content: String,
  done: Boolean
}));

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/todone'); // dbname: todone
