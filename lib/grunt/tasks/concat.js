// ============================================================================
// TASKS
// ============================================================================

task.registerBasicTask('concat', 'Concatenate files.*', function(data, name) {
  // Concat specified files.
  var errorcount = fail.errorcount;
  var files = file.expand(data);
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
    return task.directive(filepath, file.read);
  }).join('\n') : '';
});
