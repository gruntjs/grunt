var task = require('task').create();

// Register a helper.
task.registerHelper('adder', function(a, b) { return a + b; });

// Override a helper.
task.renameHelper('adder', '_adder');
task.registerHelper('adder', function(a, b, c) { return a + task.helper('_adder', b, c); });

// Register a task.
task.registerTask('foo', function(arg) {
  console.log(1, this.name, arg);
});

// Register a subtask.
task.registerTask('foo:aaa', function(arg) {
  console.log(2, this.name, arg);
});

task.registerTask('bar', function() {
  console.log(3, this.name)
});

// Create a shortcut.
task.registerTask('fb', 'foo bar');

task.run('foo').start();      // logs 1, 'foo', undefined
task.run('foo:aaa').start();  // logs 2, 'foo:aaa', 'aaa'
task.run('foo:bbb').start();  // logs 1, 'foo', 'bbb'
task.run('foo bar').start();  // logs 1, 'foo', undefined \n 3, 'bar
task.run('fb').start();       // logs 1, 'foo', undefined \n 3, 'bar





// var task = require('task').create();
// var config = require('config');
// var jshint = require('jshint').JSHINT;
// 
// task.registerTask('lint', function(arg) {
//   var files = config('lint.' + (arg || 'files'));
//   // Lint all files. If any linting fails, abort and return false, unless
//   // --force was used.
//   return file.expand(files).all(function(filepath) {
//     // Lint the file.
//     var result = task.helper('lint', file.read(filepath), config('jshint.options'), config('jshint.globals'));
//     // Abort if linting fails, unless --force was used.
//     return result !== false || option('force');
//   });
// });
// 
// task.registerHelper('lint', function(src, options, globals) {
//   if (jshint(src, options, globals)) {
//     // log "ok"
//   } else {
//     // log errors
//     return false;
//   }
// });
// 
// task.registerTask('build', function() {
//   // if 'something' task failed, abort this task.
//   if (task.requires('something')) { return false; }
// });
// 
// task.registerTask('build', function() {
//   // if 'something' task failed, throw an exception (Aorting);
//   task.succeeded('something');
// });
// 
// task.registerTask('min', function() {
//   var done = this.async();
//   setTimeout(done, 1000);
// });
// 
// task.registerTask('lint:built', function() {
//   
// });
// 
// task.registerTask('shortcut', 'this that the_other');
// 
// task.run('lint:files build min lint:built').start();






// function run(tasks) {
//   console.log('>', tasks);
// }
// 
// var queue = [];
// function enqueue(name, fn) {
//   if (typeof fn === 'string') {
//     fn = run.bind(this, fn);//(function(fn) { return function() { run(fn); }; }(fn));
//   }
//   queue.push({name: name, fn: fn});
// }
// 
// enqueue('a', 'b c d');
// enqueue('b', function() { run('c d e'); });
// 
// queue.forEach(function(obj) {
//   console.log(obj.name);
//   obj.fn();
// });






