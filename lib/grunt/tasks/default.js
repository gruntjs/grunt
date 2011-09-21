exports.info = "Execute the default task.";
exports.full = "This is a much longer description. TODO: WRITE ACTUAL DESCRIPTION";
var tasks = exports.tasks = {
  _default: function() {
    console.log("running default task");
    this.task("lint").task("min");
  }
};
