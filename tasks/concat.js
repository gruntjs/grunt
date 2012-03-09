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

task.registerBasicTask('concat', 'Concatenate files.', function(data, target) {
  // Concat specified files.
  var files = file.expand(data.src);
  // Get banner, if specified. It would be nice if UglifyJS supported ignoring
  // all comments matching a certain pattern, like /*!...*/, but it doesn't.
  var banner = task.directive(files[0], function() { return null; });
  if (banner === null) {
    banner = '';
  } else {
    files.shift();
  }
  // prepend banner
  file.write(data.dest, banner + task.helper('concat', files));

  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  // Otherwise, print a success message.
  log.writeln('File "' + data.dest + '" created.');
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
