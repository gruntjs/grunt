exports.info = "Execute the default task.";
exports.full = "This is a much longer description. TODO: WRITE ACTUAL DESCRIPTION";

exports.task = function() {
  console.log("running default task");
  return;
  
  this.task("lint").task("min");
};
