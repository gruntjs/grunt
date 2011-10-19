var fs = require('fs');

// ============================================================================
// TASKS
// ============================================================================

task.registerTask('watch', 'Run predefined tasks whenever watched files change.', function(name) {

  // If an argument is passed, use "watch:___" config property, otherwise just
  // use "watch" property. Any name with a possible "." has to be escaped.
  var propname = name ? 'watch.' + config.escape(name) : 'watch';

  // Fail if any required config properties have been omitted.
  config.requires(propname + '.files', propname + '.tasks');

  // Enable the "special" option a task can enable if errors need to be
  // forced past without all the complaining.
  option.set('silentforce', true);

  log.write('Waiting...');

  // This task is asynchronous.
  var done = this.async();
  // The files to be watched.
  var files = file.expand(config(propname + '.files'));
  // The tasks to be run.
  var tasks = config(propname + '.tasks');
  // This task's name + optional args, in string format.
  var nameArgs = this.nameArgs;

  files.forEach(function(filepath) {
    // Watch each specified file for changes. This probably won't scale to
    // hundreds of files.. but I bet someone will try it!
    fs.watchFile(filepath, {interval: 500}, function() {
      // Log which file changes.
      log.ok().ok('File "' + filepath + '" changed.');
      // Clear the modified file's cached require data.
      file.clearRequireCache(filepath);
      // Unwatch all files.
      files.forEach(fs.unwatchFile);
      // Run all specified tasks, followed by this task (so that it loops).
      task.run(tasks).run(nameArgs);
      // Continue task queue.
      done();
    });
  });
});
