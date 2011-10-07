var log = grequire('log');

module.exports = {
  info: 'Sample foo task.',
  long: 'This is a much longer description. TODO: WRITE ACTUAL DESCRIPTION',
  task: function() {
    log.writeln('foo');
    this.run(':bar');
  },
  subtasks: {
    bar: function() {
      log.writeln('foo:bar');
    },
  }
};
