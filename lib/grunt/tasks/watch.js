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

var lastTime;

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

  // Avoid duplicate-triggering of file change events.
  // https://github.com/joyent/node/issues/2126
  function isDuplicate(filepath) {
    if (!path.existsSync(filepath)) { return; }
    var time = +fs.statSync(filepath).mtime;
    if (time === lastTime) { return true; }
    lastTime = time;
  }

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
    fs.watchFile(filepath, {interval: 500}, function() {
      // If this is a duplicate event, abort.
      if (isDuplicate(filepath)) { return; }
      // Log which file has changed.
      var status = path.existsSync(filepath) ? 'changed' : 'deleted';
      log.ok().ok('File "' + filepath + '" ' + status + '.');
      // All done!
      done(filepath);
    });
  });

  // Watch for files to be added.
  intervalId = setInterval(function() {
    var f = _.difference(getFiles(), files);
    if (f.length > 0) {
      // If this is a duplicate event, abort.
      if (isDuplicate(f[0])) { return; }
      // Log which file has been added.
      log.ok().ok('File "' + f[0] + '" added.');
      // All done!
      done(f[0]);
    }
  }, 500);
});
