// ============================================================================
// TASKS
// ============================================================================

task.registerTask('concat', 'Concatenate files. Task "concat" will concatenate all files, while task "concat:foo.js" will concatenate all "foo.js" files.', function(name) {
  var props;
  if (!name) {
    // No lint property name passed.
    props = Object.keys(config('concat') || {});
    // Fail if there are no actual properties.
    if (props.length === 0) {
      log.error('No "concat" configuration properties found.');
      return false;
    }
    // Iterate over all lint config properties, running "concat:___" for each.
    props.forEach(function(name) { task.run('concat:' + name); });
    return;
  }

  // Escape any . in name with \. so namespacing works.
  var escaped = name.replace(/\./g, '\\.');

  // Fail if any required config properties have been omitted.
  config.requires('concat.' + escaped);

  // Concat specified files.
  var errorCount = fail.errors;
  var files = file.expand(config('concat.' + escaped));
  file.write(name, task.helper('concat', files));

  // Fail task if there were errors.
  if (fail.errors > errorCount) { return false; }

  // Otherwise, print a success message.
  log.writeln('File "' + name + '" created.');
});

// ============================================================================
// HELPERS
// ============================================================================

// Concat source files.
task.registerHelper('concat', function(files) {
  return files ? files.map(file.read).join('\n') : '';
});
