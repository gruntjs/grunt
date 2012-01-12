/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var fs = require('fs');
var path = require('path');

// ============================================================================
// TASKS
// ============================================================================

task.registerTask('watch', 'Run predefined tasks whenever watched files change.', function(prop) {

  var props = ['watch'];
  // If a prop was passed as the argument, use that sub-property of watch.
  if (prop) { props.push(prop); }
  // Get the files and tasks sub-properties.
  var filesProp = props.concat('files');
  var tasksProp = props.concat('tasks');

  // Fail if any required config properties have been omitted.
  config.requires(filesProp, tasksProp);

  log.write('Waiting...');

  // This task is asynchronous.
  var taskDone = this.async();
  // The files to be watched.
  var getFiles = file.expand.bind(file, config(filesProp));
  var files = getFiles();
  // The tasks to be run.
  var tasks = config(tasksProp);
  // This task's name + optional args, in string format.
  var nameArgs = this.nameArgs;
  // An ID by which the setInterval can be canceled.
  var intervalId;

  // Define an alternate fail "warn" behavior.
  fail.warnAlternate = function() {
    task.clearQueue().run(nameArgs);
  };

  // Cleanup when files have changed.
  function done(filepath) {
    // Clear the files-added setInterval.
    clearInterval(intervalId);
    // Clear the modified file's cached require data.
    file.clearRequireCache(filepath);
    // Unwatch all watched files.
    files.forEach(fs.unwatchFile);
    // Enqueue all specified tasks, followed by this task (so that it loops).
    task.run(tasks).run(nameArgs);
    // Continue task queue.
    taskDone();
  }

  // Watch existing files for changes.
  files.forEach(function(filepath) {
    // Watch each specified file for changes. This probably won't scale to
    // hundreds of files.. but I bet someone will try it!
    fs.watchFile(filepath, {interval: 500}, function(curr, prev) {
      var status = 'changed';
      if (curr.nlink < prev.nlink) {
        // The file was deleted.
        status = 'deleted';
      } else if (+curr.mtime === +prev.mtime) {
        // The file hasn't changed, so abort.
        return;
      }
      // Log which file has changed.
      log.ok().ok('File "' + filepath + '" ' + status + '.');
      // All done!
      done(filepath);
    });
  });

  // Watch for files to be added.
  intervalId = setInterval(function() {
    var filepath = underscore.difference(getFiles(), files)[0];
    if (filepath) {
      // Log which file has been added.
      log.ok().ok('File "' + filepath + '" added.');
      // All done!
      done(filepath);
    }
  }, 500);
});
