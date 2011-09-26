var log = grequire('log');

module.exports = {
  info: 'Run the "lint" and "build" tasks.',
  task: function() {
    this.task('lint').task('build');
  },
  subtasks: {}
};
