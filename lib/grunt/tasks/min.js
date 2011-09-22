var log = grequire('log');

module.exports = {
  info: 'Minify code with Uglify-js.',
  long: 'This is a much longer description. TODO: WRITE ACTUAL DESCRIPTION',
  task: function() {
    log.writeln('min');
    this.task(':a').task(':b');
  },
  subtasks: {
    a: function() {
      log.writeln('min:a');
    },
    b: function() {
      log.writeln('min:b');
    }
  }
};
