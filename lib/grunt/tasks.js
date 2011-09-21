var path = require('path');
var fs = require('fs');

var exports = module.exports = function(name) {
  console.log(exports[name]);
  exports[name].task.call(exports[name]);
};

// Get all built-in tasks. TODO: allow "local" tasks.
fs.readdirSync(path.join(__dirname, 'tasks')).forEach(function(filepath) {
  var name = filepath.replace(/\.js$/, ''); // basename?
  exports[name] = require('./tasks/' + name);
});
