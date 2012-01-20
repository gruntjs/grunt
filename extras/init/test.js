var path = require('path');

module.exports = function(done) {
  var properties = [
    {
      message: 'Project name',
      name: 'name',
      default: path.basename(process.cwd())
    },
    {
      message: 'Project description',
      name: 'description',
      default: 'A sample project.'
    },
    {
      message: 'Your name',
      name: 'author',
      default: task.helper.bind(task, 'child_process', {
        cmd: 'git',
        args: ['config', '--get', 'user.name'],
        fallback: 'Joe Spamworth'
      })
    },
    {
      message: 'Your email address',
      name: 'email',
      default: task.helper.bind(task, 'child_process', {
        cmd: 'git',
        args: ['config', '--get', 'user.email'],
        fallback: 'spam@example.com'
      })
    },
  ];

  task.helper('prompt', properties, function(err, properties) {
    console.log(properties);
    done();
  });
};
