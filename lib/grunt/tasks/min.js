exports.info = "Minify code with Uglify-js.";
exports.full = "This is a much longer description. TODO: WRITE ACTUAL DESCRIPTION";
var tasks = exports.tasks = {
  _default: function() {
    console.log("running min task");
    this.task(":a").task(":b");
  },
  a: function() {
    console.log("running min:a task");
  },
  b: function() {
    console.log("running min:b task");
  }
};
