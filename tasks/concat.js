/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

// ============================================================================
// TASKS
// ============================================================================

task.registerBasicTask('concat', 'Concatenate files.', function(data, name) {
  // Concat specified files.
  var files = file.expand(data);
  file.write(name, task.helper('concat', files));

  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  // Otherwise, print a success message.
  log.writeln('File "' + name + '" created.');
});

// ============================================================================
// HELPERS
// ============================================================================

// Concat source files and/or directives.
task.registerHelper('concat', function(files) {
  return files ? files.map(function(filepath) {
    return task.directive(filepath, file.read);
  }).join(util.linefeed) : '';
});
