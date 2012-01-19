var path = require('path');

module.exports = function(done) {
  var obj = {
    name: path.basename(process.cwd()),
    description: 'A sample project.',
    author: task.helper.bind(task, 'child_process', {
      cmd: 'git',
      args: ['config', '--get', 'user.name'],
      fallback: 'Joe User'
    }),
    email: task.helper.bind(task, 'child_process', {
      cmd: 'git',
      args: ['config', '--get', 'user.email'],
      fallback: 'joe@example.com'
    })
  };
  task.helper('prompt', obj, function(obj) {
    console.log(obj);
    done();
  });
};
