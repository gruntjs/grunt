var log = grequire('log');

module.exports = {
  info: 'Validate code with JSHint.',
  long: 'This is a much longer description. TODO: WRITE ACTUAL DESCRIPTION',
  task: function() {
    log.writeln('lint');
  },
  subtasks: {}
};
