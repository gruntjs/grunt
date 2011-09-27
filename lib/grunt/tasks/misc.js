task.registerTask('default', 'Run the "lint" and "build" tasks.', function() {
  this.task('lint').task('build');
});

// Concat source files.
task.registerHelper('concat', function(files) {
  return files.map(file.read).join('\n');
});

// Display flags in verbose mode.
task.registerHelper('verboseflags', function(obj) {
  verbose.writeln('Flags: ' + log.wordlist(Object.keys(obj).map(function(key) {
    var val = obj[key];
    return key + (val === true ? '' : '=' + JSON.stringify(val));
  })));
});
