'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    subgrunt: {
      all: ['test/gruntfile/*.js']
    },
  });

  // Some internal tasks. Maybe someday these will be released.
  grunt.loadTasks('internal-tasks');

  // "npm test" runs these tasks
  grunt.registerTask('test', ['subgrunt']);

  // Default task.
  grunt.registerTask('default', ['test']);

};
