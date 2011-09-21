var task = require('./grunt/task');
var cli = require('./grunt/cli');

// console.log('Available tasks:');
// Object.keys(tasks).forEach(function(name) {
//   console.log(name + ' -> ' + tasks[name].info);
// });

// Execute all tasks, in order. If none is specified, execute the default task.
var tasks = cli.tasks.length ? cli.tasks : ['default']
tasks.forEach(task);

//console.log(cli);

//tasks("lint");
