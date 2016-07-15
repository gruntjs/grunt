'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      all: ['test/{grunt,tasks,util}/**/*.js'],
      tap: {
        src: '<%= nodeunit.all %>',
        options: {
          reporter: 'tap',
          reporterOutput: 'tests.tap'
        }
      }
    },
    eslint: {
      gruntfile_tasks: ['Gruntfile.js', 'internal-tasks/*.js'],
      libs_n_tests: ['lib/**/*.js', '<%= nodeunit.all %>'],
      subgrunt: ['<%= subgrunt.all %>']
    },
    watch: {
      gruntfile_tasks: {
        files: ['<%= eslint.gruntfile_tasks %>'],
        tasks: ['eslint:gruntfile_tasks']
      },
      libs_n_tests: {
        files: ['<%= eslint.libs_n_tests %>'],
        tasks: ['eslint:libs_n_tests', 'nodeunit']
      },
      subgrunt: {
        files: ['<%= subgrunt.all %>'],
        tasks: ['eslint:subgrunt', 'subgrunt']
      }
    },
    subgrunt: {
      all: ['test/gruntfile/*.js']
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Some internal tasks. Maybe someday these will be released.
  grunt.loadTasks('internal-tasks');

  // "npm test" runs these tasks
  grunt.registerTask('test', '', function(reporter) {
    grunt.task.run(['eslint', 'nodeunit:' + (reporter || 'all'), 'subgrunt']);
  });

  // Default task.
  grunt.registerTask('default', ['test']);

};
