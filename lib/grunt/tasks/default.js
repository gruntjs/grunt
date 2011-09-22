module.exports = {
  info: 'Execute the default task.',
  long: 'This is a much longer description. TODO: WRITE ACTUAL DESCRIPTION',
  task: function() {
    console.log('running default task');
    this.task('lint').task('min');
  },
  subtasks: {}
};
