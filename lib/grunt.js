// Use `grequire` instead of `require` to load grunt libs.
global.grequire = require('./grunt/grequire');

var task = grequire('task');
var cli = grequire('cli');

// console.log('Available tasks:');
// Object.keys(tasks).forEach(function(name) {
//   console.log(name + ' -> ' + tasks[name].info);
// });

// Execute all tasks, in order. If none is specified, execute the default task.
var tasks = cli.tasks.length ? cli.tasks : ['default']
tasks.forEach(function(t) {
  task(t, cli.options);
});

//tasks("lint");
