var verbose = grequire('log').verbose;

module.exports = {
  info: 'Enable debugging mode.',
  long: 'This task can be used stand-alone, but might also be used by other :d subtasks.',
  task: function() {
    verbose.writeln('Debugging mode enabled.');
    __build.jshint.devel = true;
    __build.jshint.debug = true;
  },
  subtasks: {}
};
