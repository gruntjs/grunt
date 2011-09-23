var log = grequire('log');

module.exports = {
  info: 'Run the "lint" and "min" tasks.',
  long: 'This is a much longer description. TODO: WRITE ACTUAL DESCRIPTION',
  task: function() {
    this.task('lint').task('min');
  },
  subtasks: {}
};
