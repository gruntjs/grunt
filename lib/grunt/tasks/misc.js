// ============================================================================
// TASKS
// ============================================================================

// The default task. Override this in your grunt.js if you feel like it.
task.registerTask('default', 'Run the "lint" and "build" tasks.', function() {
  this.task('lint', 'test', 'build');
});

// ============================================================================
// HELPERS
// ============================================================================

// Concat source files.
task.registerHelper('concat', function(files) {
  return files ? files.map(file.read).join('\n') : '';
});
