'use strict';

var grunt = require('../../../lib/grunt');
var esprima = require('../../../tasks/lib/esprima').init(grunt);

// In case the grunt being used to test is different than the grunt being
// tested, initialize the task and config subsystems.
if (grunt.task.searchDirs.length === 0) {
  grunt.task.init([]);
  grunt.config.init({});
}

exports['esprima'] = {
  'minify': function(test) {
    test.expect(3);
    test.equal(esprima.minify('var a = 1;'), 'var a = 1;', 'Should have minified code.');
    test.equal(esprima.minify('/*\nmylib\n*/\nvar a = 1;'), '/*\nmylib\n*/\nvar a = 1;', 'Should have minified code with banner.');
    test.equal(esprima.minify('//mylib\nvar a = 1;'), '//mylib\nvar a = 1;', 'Should have minified code with banner.');

    test.done();
  }
};
