var log = grequire('log');

module.exports = {
  info: 'Execute the default task.',
  long: 'This is a much longer description. TODO: WRITE ACTUAL DESCRIPTION',
  task: function() {
    this.task('lint').task('min');
  },
  subtasks: {}
};
