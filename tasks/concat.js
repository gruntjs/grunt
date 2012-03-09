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

task.registerBasicTask('concat', 'Concatenate files.', function(target) {
  // Concat specified files.
  var files = file.expand(this.file.src);
  file.write(this.file.dest, task.helper('concat', files));

  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  // Otherwise, print a success message.
  log.writeln('File "' + this.file.dest + '" created.');
});

// ============================================================================
// HELPERS
// ============================================================================

// Concat source files and/or directives.
task.registerHelper('concat', function(files) {
  return files ? files.map(function(filepath) {
    return task.directive(filepath, file.read);
  }).join(utils.linefeed) : '';
});
