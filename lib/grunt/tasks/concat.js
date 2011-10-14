// ============================================================================
// TASKS
// ============================================================================

task.registerTask('concat', 'Concatenate files.*', function(name) {
  if (!name) {
    // An argument wasn't passed. Run this task once for each concat sub-prop.
    return task.runAllProps('concat');
  }

  // Any name with a possible "." has to be escaped!
  var propname = 'concat.' + config.escape(name);

  // Fail if any required config properties have been omitted.
  config.requires(propname);

  // Concat specified files.
  var errorcount = fail.errorcount;
  var files = file.expand(config(propname));
  file.write(name, task.helper('concat', files));

  // Fail task if there were errors.
  if (fail.errorcount > errorcount) { return false; }

  // Otherwise, print a success message.
  log.writeln('File "' + name + '" created.');
});

// ============================================================================
// HELPERS
// ============================================================================

// Concat source files.
task.registerHelper('concat', function(files) {
  return files ? files.map(function(filepath) {
    // If a directive like <banner> is passed, return that helper's result.
    var helper = config.getDirective(filepath);
    // Otherwise, read and return the file.
    return helper ? task.helper('directive', helper) : file.read(filepath);
  }).join('\n') : '';
});
