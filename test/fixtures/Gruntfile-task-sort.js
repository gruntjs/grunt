module.exports = function(grunt) {

  // Task names whose locale-aware order differs from the UTF-16 code unit order.
  ['Zeta', 'BETA', 'über', 'alpha', 'éclair', 'omega'].forEach(function(name) {
    grunt.registerTask(name, function() {});
  });

};
