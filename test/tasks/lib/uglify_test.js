'use strict';

var grunt = require('../../../lib/grunt');
var uglify = require('../../../tasks/lib/uglify').init(grunt);

// In case the grunt being used to test is different than the grunt being
// tested, initialize the task and config subsystems.
if (grunt.task.searchDirs.length === 0) {
  grunt.task.init([]);
  grunt.config.init({});
}

exports['uglify'] = {
  'minify': function(test) {
    test.expect(1);
    test.equal(uglify.minify('var a = 1;'), 'var a=1;', 'Should have minified code.');
    test.done();
  }
};
