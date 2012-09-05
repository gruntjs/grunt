'use strict';

var grunt = require('../../../lib/grunt');
var jshint = require('../../../tasks/lib/jshint').init(grunt);

// In case the grunt being used to test is different than the grunt being
// tested, initialize the task and config subsystems.
if (grunt.task.searchDirs.length === 0) {
  grunt.task.init([]);
  grunt.config.init({});
}

exports['jshint'] = function(test) {
  test.expect(1);
  grunt.log.muted = true;

  test.doesNotThrow(function() {
    jshint.lint(grunt.file.read('test/fixtures/lint.txt'));
  }, 'It should not blow up if an error occurs on character 0.');

  test.done();
};
