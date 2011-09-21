var tasks = require('./grunt/tasks');
var cli = require('./grunt/cli');

console.log('Available tasks:');
Object.keys(tasks).forEach(function(name) {
  console.log(name + ' -> ' + tasks[name].info);
});

console.log(cli);

//tasks("lint");
