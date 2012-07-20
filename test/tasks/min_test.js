'use strict';

var grunt = require('../../lib/grunt');

// In case the grunt being used to test is different than the grunt being
// tested, initialize the task and config subsystems.
if (grunt.task.searchDirs.length === 0) {
  grunt.task.init([]);
  grunt.config.init({});
}

exports['min'] = {
  'uglify': function(test) {
    test.expect(1);
    test.equal(grunt.helper('uglify', 'var a = 1;'), 'var a=1;', 'Should have minified code.');
    test.done();
  },
  'gzip': function(test) {
    test.expect(1);
    test.equal(grunt.helper('gzip', 'var a = 1;').length, 30, 'Should have gziped code.');
    test.done();
  },
  'min_max_info': function(test) {
    test.expect(1);
    var result = 0;
    var old = grunt.log.writeln;
    grunt.log.writeln = function() { result++; };
    grunt.helper('min_max_info', 'var a=1;', 'var a = 1;');
    test.equal(result, 2, 'Should have written to the log twice.');
    grunt.log.writeln = old;
    test.done();
  }
};
