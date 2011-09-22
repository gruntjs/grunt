module.exports = {
  info: 'Minify code with Uglify-js.',
  long: 'This is a much longer description. TODO: WRITE ACTUAL DESCRIPTION',
  task: function() {
    console.log('running lint task');
    this.task(':a').task(':b');
  },
  subtasks: {
    a: function() {
      console.log('running min:a task');
    },
    b: function() {
      console.log('running min:b task');
    }
  }
};
