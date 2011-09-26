var verbose = grequire('log').verbose;

module.exports = {
  info: 'Enable debugging mode.',
  task: function() {
    verbose.writeln('Debugging mode enabled.');
    __build.jshint.devel = true;
    __build.jshint.debug = true;
  },
  subtasks: {}
};
